const { GoogleGenAI } = require("@google/genai")
const puppeteer = require("puppeteer")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})

const INTERVIEW_JSON_SHAPE = `{
  "matchScore": <number 0-100>,
  "title": "<job title string>",
  "technicalQuestions": [
    { "question": "<string>", "intention": "<string>", "answer": "<string>" }
  ],
  "behavioralQuestions": [
    { "question": "<string>", "intention": "<string>", "answer": "<string>" }
  ],
  "skillGaps": [
    { "skill": "<string>", "severity": "low" | "medium" | "high" }
  ],
  "preparationPlan": [
    { "day": <number>, "focus": "<string>", "tasks": ["<string>"] }
  ]
}`

function parseJsonResponse(text) {
    const cleaned = text.trim()
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")

    return JSON.parse(cleaned)
}

function parseMaybeJson(value) {
    if (typeof value === "string") {
        try {
            return JSON.parse(value)
        } catch {
            return { question: value, intention: "", answer: "" }
        }
    }
    return value
}

function normalizeQuestions(items) {
    if (!Array.isArray(items)) {
        return []
    }

    return items
        .map(parseMaybeJson)
        .map((item) => ({
            question: item.question || item.q || item.text || "",
            intention: item.intention || item.purpose || item.reason || "",
            answer: item.answer || item.modelAnswer || item.suggestedAnswer || ""
        }))
        .filter((item) => item.question.trim())
}

function normalizeSkillGaps(items) {
    if (!Array.isArray(items)) {
        return []
    }

    return items
        .map(parseMaybeJson)
        .map((item) => ({
            skill: item.skill || item.name || item.gap || "",
            severity: [ "low", "medium", "high" ].includes(item.severity)
                ? item.severity
                : "medium"
        }))
        .filter((item) => item.skill.trim())
}

function normalizePreparationPlan(items) {
    if (!Array.isArray(items)) {
        return []
    }

    return items
        .map(parseMaybeJson)
        .map((item, index) => ({
            day: Number(item.day) || index + 1,
            focus: item.focus || item.topic || item.title || "",
            tasks: Array.isArray(item.tasks)
                ? item.tasks.map(String)
                : Array.isArray(item.task)
                    ? item.task.map(String)
                    : item.tasks
                        ? [ String(item.tasks) ]
                        : []
        }))
        .filter((item) => item.focus.trim() || item.tasks.length)
}

function findArray(data, keys) {
    for (const key of keys) {
        if (Array.isArray(data[key]) && data[key].length) {
            return data[key]
        }
    }
    return []
}

function findScore(data) {
    const candidates = [
        data.matchScore,
        data.match_score,
        data.technical_assessment_score,
        data.assessment_score,
        data.score
    ]

    for (const value of candidates) {
        const num = Number(value)
        if (!Number.isNaN(num) && num > 0) {
            return Math.min(100, Math.max(0, num))
        }
    }

    return 0
}

function deriveTitleFromJobDescription(jobDescription) {
    const firstLine = jobDescription
        .split("\n")
        .map((line) => line.trim())
        .find(Boolean)

    if (!firstLine) {
        return "Interview Preparation Plan"
    }

    return firstLine.length > 80 ? `${firstLine.slice(0, 77)}...` : firstLine
}

function normalizeInterviewReport(data, jobDescription) {
    const root = data?.interviewReport || data?.report || data

    if (!root || typeof root !== "object") {
        throw new Error("Invalid AI response format")
    }

    const title = (root.title || root.jobTitle || root.job_title || root.position || "")
        .toString()
        .trim()

    const normalized = {
        matchScore: findScore(root),
        technicalQuestions: normalizeQuestions(
            findArray(root, [
                "technicalQuestions",
                "technical_questions",
                "technical_questions_detailed",
                "technicalQuestionsDetailed"
            ])
        ),
        behavioralQuestions: normalizeQuestions(
            findArray(root, [
                "behavioralQuestions",
                "behavioral_questions",
                "behavioral_questions_detailed"
            ])
        ),
        skillGaps: normalizeSkillGaps(
            findArray(root, [ "skillGaps", "skill_gaps", "skills_gap", "gaps" ])
        ),
        preparationPlan: normalizePreparationPlan(
            findArray(root, [
                "preparationPlan",
                "preparation_plan",
                "roadmap",
                "roadMap",
                "studyPlan"
            ])
        ),
        title: title || deriveTitleFromJobDescription(jobDescription)
    }

    if (
        !normalized.technicalQuestions.length &&
        !normalized.behavioralQuestions.length &&
        !normalized.preparationPlan.length
    ) {
        throw new Error(
            "AI returned an incomplete interview plan. Please try generating again."
        )
    }

    if (!normalized.matchScore) {
        normalized.matchScore = Math.min(
            95,
            50 +
                normalized.technicalQuestions.length * 3 +
                normalized.behavioralQuestions.length * 2
        )
    }

    return normalized
}

function formatAiError(err) {
    const message = err?.message || String(err)

    if (message.includes("quota") || message.includes("429")) {
        return new Error("Gemini API quota exceeded. Check billing or try again later.")
    }

    if (message.includes("API key")) {
        return new Error("Invalid or missing Google AI API key.")
    }

    return err
}

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    const prompt = `You are an expert interview coach. Generate a detailed interview preparation report.

Return ONLY valid JSON (no markdown) using EXACTLY these property names:
${INTERVIEW_JSON_SHAPE}

Requirements:
- matchScore: number from 0 to 100
- title: short job title from the job description
- technicalQuestions: at least 5 items
- behavioralQuestions: at least 5 items
- skillGaps: at least 3 items with severity low|medium|high
- preparationPlan: at least 5 days with tasks array

Candidate Resume:
${resume || "Not provided"}

Candidate Self Description:
${selfDescription || "Not provided"}

Target Job Description:
${jobDescription}
`

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: {
                responseMimeType: "application/json"
            }
        })

        if (!response.text) {
            throw new Error("AI returned an empty response. Please try again.")
        }

        const raw = parseJsonResponse(response.text)
        return normalizeInterviewReport(raw, jobDescription)
    } catch (err) {
        throw formatAiError(err)
    }
}

async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch({
        headless: true,
        args: [ "--no-sandbox", "--disable-setuid-sandbox" ]
    })
    const page = await browser.newPage()
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    const pdfBuffer = await page.pdf({
        format: "A4",
        margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    })

    await browser.close()

    return pdfBuffer
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
    const prompt = `Generate a tailored resume as JSON with one field "html" containing complete HTML for PDF conversion.

Resume source:
${resume || "Not provided"}

Self description:
${selfDescription || "Not provided"}

Job description:
${jobDescription}

Return ONLY JSON: { "html": "<full html document>" }
`

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: {
                responseMimeType: "application/json"
            }
        })

        if (!response.text) {
            throw new Error("AI returned an empty response. Please try again.")
        }

        const jsonContent = parseJsonResponse(response.text)
        const html = jsonContent.html || jsonContent.HTML || jsonContent.content

        if (!html) {
            throw new Error("AI did not return resume HTML.")
        }

        return await generatePdfFromHtml(html)
    } catch (err) {
        throw formatAiError(err)
    }
}

const COLD_EMAIL_JSON_SHAPE = `{
  "subject": "<concise email subject line>",
  "body": "<full email body with greeting, paragraphs, and sign-off placeholder e.g. [Your Name]>",
  "recipientType": "<who to send to, e.g. Hiring Manager, Recruiter>",
  "keyHighlights": ["<string>", "<string>", "<string>"],
  "tips": ["<string>", "<string>"]
}`

function normalizeColdEmail(data, jobDescription) {
    const root = data?.coldEmail || data?.email || data

    if (!root || typeof root !== "object") {
        throw new Error("Invalid AI response format")
    }

    const subject = (root.subject || root.subjectLine || "").toString().trim()
    const body = (root.body || root.emailBody || root.content || "").toString().trim()

    if (!subject || !body) {
        throw new Error("AI returned an incomplete cold email. Please try again.")
    }

    const keyHighlights = Array.isArray(root.keyHighlights)
        ? root.keyHighlights.map(String).filter(Boolean)
        : Array.isArray(root.highlights)
            ? root.highlights.map(String).filter(Boolean)
            : []

    const tips = Array.isArray(root.tips)
        ? root.tips.map(String).filter(Boolean)
        : []

    const title = (root.roleTitle || root.title || deriveTitleFromJobDescription(jobDescription))
        .toString()
        .trim()

    return {
        subject,
        body,
        recipientType: (root.recipientType || root.recipient || "Hiring Manager").toString().trim(),
        keyHighlights,
        tips,
        title: title || "Cold Email"
    }
}

async function generateColdEmail({ resume, selfDescription, jobDescription }) {
    const prompt = `You are an expert career coach and copywriter. Write a professional, concise cold outreach email for a job application or networking.

Return ONLY valid JSON (no markdown) using EXACTLY these property names:
${COLD_EMAIL_JSON_SHAPE}

Requirements:
- subject: under 70 characters, specific to the role
- body: 150-250 words, professional but warm, no fake claims; reference real skills from the candidate profile
- Use placeholders only for name/contact if missing: [Your Name], [Your Email]
- keyHighlights: 3 bullets summarizing why the candidate fits
- tips: 2 short tips for sending this email
- Do not invent employers or degrees not supported by the profile

Candidate Resume:
${resume || "Not provided"}

Candidate Self Description:
${selfDescription || "Not provided"}

Target Job Description:
${jobDescription}
`

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: {
                responseMimeType: "application/json"
            }
        })

        if (!response.text) {
            throw new Error("AI returned an empty response. Please try again.")
        }

        const raw = parseJsonResponse(response.text)
        return normalizeColdEmail(raw, jobDescription)
    } catch (err) {
        throw formatAiError(err)
    }
}

module.exports = { generateInterviewReport, generateResumePdf, generateColdEmail }

const { PDFParse } = require("pdf-parse")
const { generateColdEmail } = require("../services/ai.service")
const coldEmailModel = require("../models/coldEmail.model")

async function generateColdEmailController(req, res) {
    const { selfDescription, jobDescription } = req.body

    if (!jobDescription?.trim()) {
        return res.status(400).json({
            message: "Job description is required."
        })
    }

    if (!req.file && !selfDescription?.trim()) {
        return res.status(400).json({
            message: "Either a resume PDF or a self description is required."
        })
    }

    let resumeText = ""

    if (req.file) {
        const parser = new PDFParse(new Uint8Array(req.file.buffer))
        const resumeContent = await parser.getText()
        resumeText = resumeContent.text?.trim() || ""
    }

    const coldEmailByAi = await generateColdEmail({
        resume: resumeText,
        selfDescription: selfDescription?.trim() || "",
        jobDescription: jobDescription.trim()
    })

    const coldEmail = await coldEmailModel.create({
        user: req.user.id,
        resume: resumeText,
        selfDescription: selfDescription?.trim() || "",
        jobDescription: jobDescription.trim(),
        ...coldEmailByAi
    })

    res.status(201).json({
        message: "Cold email generated successfully.",
        coldEmail
    })
}

async function getColdEmailByIdController(req, res) {
    const { coldEmailId } = req.params

    const coldEmail = await coldEmailModel.findOne({
        _id: coldEmailId,
        user: req.user.id
    })

    if (!coldEmail) {
        return res.status(404).json({
            message: "Cold email not found."
        })
    }

    res.status(200).json({
        message: "Cold email fetched successfully.",
        coldEmail
    })
}

async function getAllColdEmailsController(req, res) {
    const coldEmails = await coldEmailModel
        .find({ user: req.user.id })
        .sort({ createdAt: -1 })
        .select("-resume -selfDescription -jobDescription -body -__v")

    res.status(200).json({
        message: "Cold emails fetched successfully.",
        coldEmails
    })
}

module.exports = {
    generateColdEmailController,
    getColdEmailByIdController,
    getAllColdEmailsController
}

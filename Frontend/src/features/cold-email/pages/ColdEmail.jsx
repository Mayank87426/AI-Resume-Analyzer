import { useRef, useState } from "react"
import { Link } from "react-router"
import "../../interview/style/home.scss"
import "../styles/cold-email.scss"
import { useColdEmail } from "../hooks/useColdEmail"

const ColdEmail = () => {
    const resumeInputRef = useRef()
    const [ jobDescription, setJobDescription ] = useState("")
    const [ selfDescription, setSelfDescription ] = useState("")
    const [ localError, setLocalError ] = useState("")
    const [ copied, setCopied ] = useState("")

    const {
        loading,
        email,
        emails,
        error,
        setError,
        generate,
        loadEmailById,
        copyToClipboard,
        clearEmail
    } = useColdEmail()

    const displayError = localError || error

    const handleGenerate = async () => {
        setLocalError("")
        setError("")

        if (!jobDescription.trim()) {
            setLocalError("Please provide a job description.")
            return
        }

        const resumeFile = resumeInputRef.current?.files?.[ 0 ]

        if (!resumeFile && !selfDescription.trim()) {
            setLocalError("Please upload a resume or provide a self description.")
            return
        }

        await generate({ jobDescription, selfDescription, resumeFile })
    }

    const handleCopy = async (label, text) => {
        const ok = await copyToClipboard(text)
        if (ok) {
            setCopied(label)
            setTimeout(() => setCopied(""), 2000)
        }
    }

    const handleSelectRecent = async (id) => {
        setLocalError("")
        setError("")
        await loadEmailById(id)
    }

    if (loading && !email) {
        return (
            <main className="loading-screen">
                <span className="orb orb--pink" />
                <span className="orb orb--purple" />
                <div className="loader" />
                <h1>Crafting your cold email...</h1>
            </main>
        )
    }

    return (
        <div className="cold-email-page home-page">
            <div className="bg-orbs" aria-hidden="true">
                <span /><span /><span />
            </div>

            {displayError && <p className="home-error">{displayError}</p>}

            <Link to="/dashboard" className="home-page__back">
                ← Back to Dashboard
            </Link>

            <header className="page-header">
                <h1>
                    <span className="highlight">Cold Email</span> Generator
                </h1>
                <p>
                    Paste a job description and your profile — AI writes a tailored outreach email for recruiters and hiring managers.
                </p>
            </header>

            {!email ? (
                <div className="interview-card">
                    <div className="interview-card__body">
                        <div className="panel panel--left">
                            <div className="panel__header">
                                <span className="panel__icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
                                </span>
                                <h2>Target Job Description</h2>
                                <span className="badge badge--required">Required</span>
                            </div>
                            <textarea
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                className="panel__textarea"
                                placeholder="Paste the full job description here..."
                                maxLength={5000}
                            />
                        </div>

                        <div className="panel-divider" />

                        <div className="panel panel--right">
                            <div className="panel__header">
                                <span className="panel__icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                </span>
                                <h2>Your Profile</h2>
                            </div>

                            <div className="upload-section">
                                <label className="section-label">
                                    Upload Resume
                                    <span className="badge badge--best">Best Results</span>
                                </label>
                                <label className="dropzone" htmlFor="cold-resume">
                                    <span className="dropzone__icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /></svg>
                                    </span>
                                    <p className="dropzone__title">Click to upload or drag &amp; drop</p>
                                    <p className="dropzone__subtitle">PDF (Max 5MB)</p>
                                    <input
                                        ref={resumeInputRef}
                                        hidden
                                        type="file"
                                        id="cold-resume"
                                        name="resume"
                                        accept=".pdf"
                                    />
                                </label>
                            </div>

                            <div className="or-divider"><span>OR</span></div>

                            <div className="self-description">
                                <label className="section-label" htmlFor="coldSelfDescription">
                                    Quick Self-Description
                                </label>
                                <textarea
                                    value={selfDescription}
                                    onChange={(e) => setSelfDescription(e.target.value)}
                                    id="coldSelfDescription"
                                    className="panel__textarea panel__textarea--short"
                                    placeholder="Briefly describe your experience, key skills, and years of experience..."
                                />
                            </div>

                            <div className="info-box">
                                <span className="info-box__icon">ℹ</span>
                                <p>
                                    Either a <strong>Resume</strong> or a <strong>Self Description</strong> is required to personalize your email.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="interview-card__footer">
                        <span className="footer-info">AI-Powered Email Generation · Approx 20s</span>
                        <button
                            type="button"
                            onClick={handleGenerate}
                            disabled={loading}
                            className="generate-btn"
                        >
                            Generate Cold Email
                        </button>
                    </div>
                </div>
            ) : (
                <section className="cold-email-result">
                    <div className="cold-email-result__toolbar">
                        <button
                            type="button"
                            className="cold-email-result__back-btn"
                            onClick={() => {
                                clearEmail()
                                setError("")
                                setLocalError("")
                            }}
                        >
                            ← Generate another
                        </button>
                        <span className="cold-email-result__meta">
                            For: {email.recipientType || "Hiring Manager"}
                        </span>
                    </div>

                    <div className="cold-email-result__card">
                        <div className="cold-email-result__subject-row">
                            <label>Subject</label>
                            <p>{email.subject}</p>
                            <button
                                type="button"
                                className="cold-email-result__copy"
                                onClick={() => handleCopy("subject", email.subject)}
                            >
                                {copied === "subject" ? "Copied!" : "Copy subject"}
                            </button>
                        </div>

                        <div className="cold-email-result__body-row">
                            <label>Email body</label>
                            <pre className="cold-email-result__body">{email.body}</pre>
                            <button
                                type="button"
                                className="cold-email-result__copy"
                                onClick={() => handleCopy("body", email.body)}
                            >
                                {copied === "body" ? "Copied!" : "Copy email"}
                            </button>
                        </div>
                    </div>

                    {email.keyHighlights?.length > 0 && (
                        <div className="cold-email-result__highlights">
                            <h3>Why you fit</h3>
                            <ul>
                                {email.keyHighlights.map((item, i) => (
                                    <li key={i}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {email.tips?.length > 0 && (
                        <div className="cold-email-result__tips">
                            <h3>Sending tips</h3>
                            <ul>
                                {email.tips.map((tip, i) => (
                                    <li key={i}>{tip}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </section>
            )}

            {emails.length > 0 && !email && (
                <section className="recent-reports">
                    <h2>Recent Cold Emails</h2>
                    <ul className="reports-list">
                        {emails.map((item) => (
                            <li
                                key={item._id}
                                className="report-item"
                                onClick={() => handleSelectRecent(item._id)}
                            >
                                <h3>{item.title || "Untitled Role"}</h3>
                                <p className="report-meta">
                                    {new Date(item.createdAt).toLocaleDateString()}
                                </p>
                                <p className="match-score score--high">{item.subject}</p>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </div>
    )
}

export default ColdEmail

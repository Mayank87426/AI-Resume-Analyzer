const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()

app.set("trust proxy", 1)

const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)

app.use(cors({
    origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true)
        } else {
            callback(null, false)
        }
    },
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())

const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")
const coldEmailRouter = require("./routes/coldEmail.routes")

app.get("/api/health", (req, res) => {
    res.json({ ok: true, message: "API is running" })
})

app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)
app.use("/api/cold-email", coldEmailRouter)

app.use((err, req, res, next) => {
    console.error(err)

    if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ message: "File too large. Maximum size is 5MB." })
    }

    if (err.message === "Only PDF files are allowed") {
        return res.status(400).json({ message: err.message })
    }

    if (err.name === "ValidationError") {
        const message = Object.values(err.errors || {})
            .map((e) => e.message)
            .join(", ")

        return res.status(400).json({ message: message || "Validation failed" })
    }

    let message = err.message || "Internal server error"

    if (typeof message === "string" && message.startsWith("{")) {
        try {
            const parsed = JSON.parse(message)
            message = parsed?.error?.message || message
        } catch {
            // keep original message
        }
    }

    res.status(err.status || 500).json({ message })
})

module.exports = app

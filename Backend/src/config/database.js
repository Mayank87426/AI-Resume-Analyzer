const mongoose = require("mongoose")
const https = require("https")

function getPublicIp() {
    return new Promise((resolve) => {
        https
            .get("https://api.ipify.org?format=json", (res) => {
                let data = ""
                res.on("data", (chunk) => { data += chunk })
                res.on("end", () => {
                    try {
                        resolve(JSON.parse(data).ip)
                    } catch {
                        resolve(null)
                    }
                })
            })
            .on("error", () => resolve(null))
    })
}

async function connectToDB() {
    const uri = process.env.MONGO_URI

    if (!uri?.trim()) {
        throw new Error(
            "MONGO_URI is missing. Add your MongoDB connection string to Backend/.env"
        )
    }

    try {
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 10000
        })
        console.log("Connected to database")
    } catch (err) {
        const message = err.message || String(err)

        if (
            message.includes("whitelist") ||
            message.includes("Could not connect to any servers")
        ) {
            const ip = await getPublicIp()
            const ipHint = ip
                ? `Whitelist this IP in Atlas Network Access: ${ip}`
                : "Whitelist your current IP in Atlas Network Access"

            throw new Error(
                `MongoDB Atlas connection failed. ${ipHint}. Or add 0.0.0.0/0 for local dev only. Run: npm run check:db — https://www.mongodb.com/docs/atlas/security-whitelist/`
            )
        }

        if (message.includes("authentication failed")) {
            throw new Error(
                "MongoDB authentication failed. Check username/password in MONGO_URI."
            )
        }

        throw new Error(`Database connection failed: ${message}`)
    }
}

module.exports = connectToDB

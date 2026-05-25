require("dotenv").config({ quiet: true })

const https = require("https")
const mongoose = require("mongoose")

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
                        resolve("unknown")
                    }
                })
            })
            .on("error", () => resolve("unknown"))
    })
}

async function main() {
    const ip = await getPublicIp()
    const uri = process.env.MONGO_URI

    console.log("--- MongoDB connection check ---")
    console.log("Your public IP (whitelist this in Atlas):", ip)
    console.log("MONGO_URI set:", Boolean(uri?.trim()))

    if (!uri?.trim()) {
        console.error("FAIL: MONGO_URI missing in Backend/.env")
        process.exit(1)
    }

    try {
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 12000 })
        console.log("SUCCESS: Connected to MongoDB Atlas")
        process.exit(0)
    } catch (err) {
        console.error("FAIL:", err.message)
        console.log("\nAtlas fix:")
        console.log("1. https://cloud.mongodb.com → your project")
        console.log("2. Network Access → Add IP Address")
        console.log(`3. Add: ${ip}  (or 0.0.0.0/0 for dev only)`)
        console.log("4. Wait until status is Active, then run: npm run dev")
        process.exit(1)
    }
}

main()

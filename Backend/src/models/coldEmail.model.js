const mongoose = require("mongoose")

const coldEmailSchema = new mongoose.Schema({
    jobDescription: {
        type: String,
        required: [ true, "Job description is required" ]
    },
    resume: {
        type: String
    },
    selfDescription: {
        type: String
    },
    subject: {
        type: String,
        required: [ true, "Subject is required" ]
    },
    body: {
        type: String,
        required: [ true, "Body is required" ]
    },
    recipientType: {
        type: String,
        default: "Hiring Manager"
    },
    keyHighlights: [ {
        type: String
    } ],
    tips: [ {
        type: String
    } ],
    title: {
        type: String,
        required: [ true, "Title is required" ]
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    }
}, {
    timestamps: true
})

const coldEmailModel = mongoose.model("ColdEmail", coldEmailSchema)

module.exports = coldEmailModel

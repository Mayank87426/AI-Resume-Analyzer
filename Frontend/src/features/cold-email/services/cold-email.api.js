import api from "../../../lib/api"

export const generateColdEmail = async ({ jobDescription, selfDescription, resumeFile }) => {
    const formData = new FormData()
    formData.append("jobDescription", jobDescription)
    formData.append("selfDescription", selfDescription || "")

    if (resumeFile) {
        formData.append("resume", resumeFile)
    }

    const response = await api.post("/api/cold-email/", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })

    return response.data
}

export const getColdEmailById = async (coldEmailId) => {
    const response = await api.get(`/api/cold-email/${coldEmailId}`)
    return response.data
}

export const getAllColdEmails = async () => {
    const response = await api.get("/api/cold-email/")
    return response.data
}

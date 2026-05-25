import axios from "axios"

function normalizeApiBaseUrl(url) {
    if (!url?.trim()) {
        return "http://localhost:3000"
    }

    let base = url.trim().replace(/\/+$/, "")

    // Avoid /api/api/auth/... when VITE_API_URL mistakenly ends with /api
    if (base.endsWith("/api")) {
        base = base.slice(0, -4)
    }

    return base
}

export const apiBaseURL = normalizeApiBaseUrl(import.meta.env.VITE_API_URL)

const api = axios.create({
    baseURL: apiBaseURL,
    withCredentials: true
})

export default api

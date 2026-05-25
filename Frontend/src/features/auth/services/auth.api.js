import api from "../../../lib/api"

function getErrorMessage(err) {
    if (err.response?.status === 404) {
        return `API not found (404). Check VITE_API_URL — requests should go to your Render backend, e.g. https://your-app.onrender.com/api/auth/login`
    }

    return err.response?.data?.message || err.message || "Request failed"
}

export async function register({ username, email, password }) {
    const response = await api.post("/api/auth/register", {
        username,
        email,
        password
    })
    return response.data
}

export async function login({ email, password }) {
    const response = await api.post("/api/auth/login", {
        email,
        password
    })
    return response.data
}

export async function logout() {
    const response = await api.get("/api/auth/logout")
    return response.data
}

export async function getMe() {
    const response = await api.get("/api/auth/get-me")
    return response.data
}

export { getErrorMessage }

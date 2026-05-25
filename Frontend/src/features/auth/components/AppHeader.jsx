import { useNavigate, Link } from "react-router"
import { useAuth } from "../hooks/useAuth"
import "../styles/app-header.scss"

const AppHeader = () => {
    const { handleLogout, loading } = useAuth()
    const navigate = useNavigate()

    const onLogout = async () => {
        const result = await handleLogout()
        if (result?.success) {
            navigate("/login", { replace: true })
        }
    }

    return (
        <header className="app-header">
            <Link to="/dashboard" className="app-brand">
                <span className="app-brand__icon">✦</span>
                <span className="app-brand__name">TalentLens</span>
            </Link>
            <button
                type="button"
                className="button btn-secondary app-header__logout"
                onClick={onLogout}
                disabled={loading}
            >
                Logout
            </button>
        </header>
    )
}

export default AppHeader

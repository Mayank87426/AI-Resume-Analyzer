import { Link } from "react-router"
import { useAuth } from "../../auth/hooks/useAuth"
import "../styles/dashboard.scss"

const OPTIONS = [
    {
        id: "interview-prep",
        to: "/interview-prep",
        icon: "✦",
        title: "Interview Prep Generation",
        description:
            "Upload your resume, paste a job description, and get a personalized interview strategy with questions and a prep roadmap.",
        accent: "magenta",
    },
    {
        id: "cold-email",
        to: "/cold-email",
        icon: "✉",
        title: "Cold Email Generator",
        description:
            "Craft tailored outreach emails for recruiters and hiring managers based on your profile and target role.",
        accent: "cyan",
    },
]

const Dashboard = () => {
    const { user } = useAuth()
    const displayName = user?.username || user?.email?.split("@")[0] || "there"

    return (
        <div className="user-dashboard">
            <div className="user-dashboard__bg" aria-hidden="true">
                <span className="user-dashboard__orb user-dashboard__orb--1" />
                <span className="user-dashboard__orb user-dashboard__orb--2" />
            </div>

            <section className="user-dashboard__welcome">
                <p className="user-dashboard__eyebrow">Welcome back</p>
                <h1>
                    Hey, <span className="highlight">{displayName}</span>
                </h1>
                <p className="user-dashboard__sub">
                    What would you like to work on today? Pick a tool below to get started.
                </p>
            </section>

            <div className="user-dashboard__grid">
                {OPTIONS.map((option, i) => (
                    <Link
                        key={option.id}
                        to={option.to}
                        className={`user-dashboard__card user-dashboard__card--${option.accent}`}
                        style={{ animationDelay: `${0.1 * i}s` }}
                    >
                        <span className="user-dashboard__card-icon">{option.icon}</span>
                        <h2>{option.title}</h2>
                        <p>{option.description}</p>
                        <span className="user-dashboard__card-cta">
                            Open
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <line x1="5" y1="12" x2="19" y2="12" />
                                <polyline points="12 5 19 12 12 19" />
                            </svg>
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default Dashboard

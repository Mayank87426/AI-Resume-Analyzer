import { Link } from "react-router"
import "../styles/landing.scss"

const FEATURES = [
    {
        icon: "✦",
        title: "AI Interview Strategy",
        description:
            "Paste a job description and your resume — our AI builds a tailored interview plan in seconds.",
        accent: "magenta",
    },
    {
        icon: "◎",
        title: "Match Score Analysis",
        description:
            "See how closely your profile aligns with the role with an instant, visual match percentage.",
        accent: "cyan",
    },
    {
        icon: "◈",
        title: "Technical & Behavioral Q&A",
        description:
            "Practice with curated questions, interviewer intentions, and model answers for every scenario.",
        accent: "violet",
    },
    {
        icon: "◇",
        title: "Skill Gap Detection",
        description:
            "Identify missing skills ranked by severity so you know exactly what to sharpen before the interview.",
        accent: "gold",
    },
    {
        icon: "▣",
        title: "Preparation Roadmap",
        description:
            "Follow a day-by-day study plan designed around your gaps and the job requirements.",
        accent: "blue",
    },
    {
        icon: "⬡",
        title: "Resume Export",
        description:
            "Download a polished PDF of your optimized resume whenever you need it.",
        accent: "magenta",
    },
]

const STEPS = [
    { num: "01", label: "Upload your resume or describe your experience" },
    { num: "02", label: "Paste the target job description" },
    { num: "03", label: "Get your personalized interview strategy" },
]

const Landing = () => {
    return (
        <div className="landing">
            <div className="landing__bg" aria-hidden="true">
                <span className="landing__orb landing__orb--1" />
                <span className="landing__orb landing__orb--2" />
                <span className="landing__orb landing__orb--3" />
                <span className="landing__grid" />
            </div>

            <header className="landing__header">
                <Link to="/" className="landing__brand">
                    <span className="landing__brand-icon">✦</span>
                    <span className="landing__brand-name">TalentLens</span>
                </Link>
                <nav className="landing__nav">
                    <Link to="/login" className="button btn-secondary landing__nav-btn">
                        Login
                    </Link>
                    <Link to="/register" className="button primary-button landing__nav-btn">
                        Register
                    </Link>
                </nav>
            </header>

            <main className="landing__main">
                <section className="landing__hero">
                    <p className="landing__eyebrow landing__reveal landing__reveal--1">
                        Gen AI · Resume · Interview Prep
                    </p>
                    <h1 className="landing__title landing__reveal landing__reveal--2">
                        <span className="landing__title-word">Talent</span>
                        <span className="landing__title-word landing__title-word--accent">Lens</span>
                    </h1>
                    <p className="landing__tagline landing__reveal landing__reveal--3">
                        Turn any job posting into a winning interview strategy. Analyze your fit,
                        close skill gaps, and walk in prepared — powered by AI.
                    </p>
                    <div className="landing__cta landing__reveal landing__reveal--4">
                        <Link to="/register" className="button primary-button landing__cta-primary">
                            Get Started Free
                        </Link>
                        <Link to="/login" className="button btn-ghost landing__cta-secondary">
                            I already have an account
                        </Link>
                    </div>
                    <div className="landing__hero-visual landing__reveal landing__reveal--5" aria-hidden="true">
                        <div className="landing__ring landing__ring--outer" />
                        <div className="landing__ring landing__ring--mid" />
                        <div className="landing__ring landing__ring--inner">
                            <span className="landing__ring-score">87</span>
                            <span className="landing__ring-label">Match</span>
                        </div>
                    </div>
                </section>

                <section className="landing__features">
                    <h2 className="landing__section-title landing__reveal">
                        Everything you need to <span className="highlight">ace the interview</span>
                    </h2>
                    <div className="landing__feature-grid">
                        {FEATURES.map((feature, i) => (
                            <article
                                key={feature.title}
                                className={`landing__feature landing__feature--${feature.accent} landing__reveal`}
                                style={{ animationDelay: `${0.08 * i}s` }}
                            >
                                <span className="landing__feature-icon">{feature.icon}</span>
                                <h3>{feature.title}</h3>
                                <p>{feature.description}</p>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="landing__how">
                    <h2 className="landing__section-title landing__reveal">
                        Three steps to your <span className="highlight">custom plan</span>
                    </h2>
                    <ol className="landing__steps">
                        {STEPS.map((step, i) => (
                            <li
                                key={step.num}
                                className="landing__step landing__reveal"
                                style={{ animationDelay: `${0.12 * i}s` }}
                            >
                                <span className="landing__step-num">{step.num}</span>
                                <p>{step.label}</p>
                            </li>
                        ))}
                    </ol>
                </section>

                <section className="landing__bottom-cta landing__reveal">
                    <h2>Ready to see yourself through the recruiter&apos;s lens?</h2>
                    <p>Join TalentLens and generate your first interview strategy today.</p>
                    <div className="landing__bottom-btns">
                        <Link to="/register" className="button primary-button">
                            Create Account
                        </Link>
                        <Link to="/login" className="button btn-secondary">
                            Sign In
                        </Link>
                    </div>
                </section>
            </main>

            <footer className="landing__footer">
                <span className="landing__footer-brand">✦ TalentLens</span>
                <p>AI-powered interview preparation</p>
                <a
                    href="https://in.linkedin.com/in/mayank-jha-4b4b60283"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="landing__contact-btn"
                    aria-label="Contact"
                >
                    Contact
                </a>
            </footer>
        </div>
    )
}

export default Landing

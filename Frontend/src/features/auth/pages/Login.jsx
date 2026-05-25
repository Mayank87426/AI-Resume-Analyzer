import { useState } from 'react'
import { useNavigate, Link, Navigate } from 'react-router'
import "../auth.form.scss"
import { useAuth } from '../hooks/useAuth'

const Login = () => {
    const { loading, handleLogin, user } = useAuth()
    const navigate = useNavigate()
    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")
    const [ error, setError ] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        const result = await handleLogin({ email, password })
        if (result?.success) {
            navigate("/dashboard")
        } else {
            setError(result?.message || "Login failed")
        }
    }

    if (!loading && user) {
        return <Navigate to="/dashboard" replace />
    }

    if (loading) {
        return (
            <main className="loading-screen">
                <span className="orb orb--pink" />
                <span className="orb orb--purple" />
                <div className="loader" />
                <h1>Loading...</h1>
            </main>
        )
    }

    return (
        <main className="auth-page">
            <div className="form-container">
                <h1>Welcome back</h1>
                {error && <p className="form-error">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            onChange={(e) => { setEmail(e.target.value) }}
                            type="email" id="email" name='email' placeholder='Enter email address' />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            onChange={(e) => { setPassword(e.target.value) }}
                            type="password" id="password" name='password' placeholder='Enter password' />
                    </div>
                    <button className='button primary-button' >Login</button>
                </form>
                <p>Don't have an account? <Link to={"/register"} >Register</Link> </p>
            </div>
        </main>
    )
}

export default Login
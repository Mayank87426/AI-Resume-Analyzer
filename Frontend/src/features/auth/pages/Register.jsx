import { useState } from 'react'
import { useNavigate, Link, Navigate } from 'react-router'
import "../auth.form.scss"
import { useAuth } from '../hooks/useAuth'

const Register = () => {

    const navigate = useNavigate()
    const [ username, setUsername ] = useState("")
    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")
    const [ error, setError ] = useState("")

    const { loading, handleRegister, user } = useAuth()

    if (!loading && user) {
        return <Navigate to="/dashboard" replace />
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        const result = await handleRegister({ username, email, password })
        if (result?.success) {
            navigate("/dashboard")
        } else {
            setError(result?.message || "Registration failed")
        }
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
                <h1>Create account</h1>

                {error && <p className="form-error">{error}</p>}
                <form onSubmit={handleSubmit}>

                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input
                            onChange={(e) => { setUsername(e.target.value) }}
                            type="text" id="username" name='username' placeholder='Enter username' />
                    </div>
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

                    <button className='button primary-button' >Register</button>

                </form>

                <p>Already have an account? <Link to={"/login"} >Login</Link> </p>
            </div>
        </main>
    )
}

export default Register
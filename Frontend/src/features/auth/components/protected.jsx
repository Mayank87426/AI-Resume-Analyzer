import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";
import AppHeader from "./AppHeader";

const Protected = ({children}) => {
    const { loading,user } = useAuth()


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

    if(!user){
        return <Navigate to={'/login'} />
    }
    
    return (
        <div className="app-shell">
            <AppHeader />
            <div className="app-shell__content">{children}</div>
        </div>
    )
}

export default Protected
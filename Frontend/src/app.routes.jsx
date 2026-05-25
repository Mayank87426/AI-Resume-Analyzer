import { createBrowserRouter } from "react-router";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Protected from "./features/auth/components/protected.jsx";
import Landing from "./features/landing/pages/Landing";
import Dashboard from "./features/dashboard/pages/Dashboard";
import Home from "./features/interview/pages/Home";
import Interview from "./features/interview/pages/Interview";
import ColdEmail from "./features/cold-email/pages/ColdEmail";


export const router = createBrowserRouter([
    {
        path: "/",
        element: <Landing />
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/dashboard",
        element: <Protected><Dashboard /></Protected>
    },
    {
        path: "/interview-prep",
        element: <Protected><Home /></Protected>
    },
    {
        path: "/cold-email",
        element: <Protected><ColdEmail /></Protected>
    },
    {
        path: "/interview/:interviewId",
        element: <Protected><Interview /></Protected>
    }
])
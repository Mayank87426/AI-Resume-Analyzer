import { useCallback, useEffect, useState } from "react"
import {
    generateColdEmail,
    getAllColdEmails,
    getColdEmailById
} from "../services/cold-email.api"

export const useColdEmail = () => {
    const [ loading, setLoading ] = useState(false)
    const [ email, setEmail ] = useState(null)
    const [ emails, setEmails ] = useState([])
    const [ error, setError ] = useState("")

    const generate = async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true)
        setError("")

        try {
            const response = await generateColdEmail({
                jobDescription,
                selfDescription,
                resumeFile
            })
            setEmail(response.coldEmail)
            setEmails((prev) => [ response.coldEmail, ...prev ])
            return { success: true, data: response.coldEmail }
        } catch (err) {
            const message =
                err.response?.data?.message ||
                err.message ||
                "Failed to generate cold email"
            setError(message)
            return { success: false, error: message }
        } finally {
            setLoading(false)
        }
    }

    const loadEmailById = useCallback(async (id) => {
        if (email?._id === id) {
            return email
        }

        setLoading(true)
        setError("")

        try {
            const response = await getColdEmailById(id)
            setEmail(response.coldEmail)
            return response.coldEmail
        } catch (err) {
            const message = err.response?.data?.message || err.message
            setError(message)
            setEmail(null)
            return null
        } finally {
            setLoading(false)
        }
    }, [ email ])

    const loadRecentEmails = useCallback(async () => {
        try {
            const response = await getAllColdEmails()
            setEmails(response.coldEmails || [])
        } catch (err) {
            console.error(err)
        }
    }, [])

    useEffect(() => {
        loadRecentEmails()
    }, [ loadRecentEmails ])

    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text)
            return true
        } catch {
            return false
        }
    }

    const clearEmail = () => setEmail(null)

    return {
        loading,
        email,
        emails,
        error,
        setError,
        generate,
        loadEmailById,
        copyToClipboard,
        clearEmail
    }
}

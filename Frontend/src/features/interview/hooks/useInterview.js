import { getAllInterviewReports, generateInterviewReport, getInterviewReportById, generateResumePdf } from "../services/interview.api"
import { useContext, useEffect } from "react"
import { InterviewContext } from "../interview.context.jsx"
import { useParams, useLocation } from "react-router"

function hasReportContent(report) {
    return Boolean(
        report?.technicalQuestions?.length ||
        report?.behavioralQuestions?.length ||
        report?.preparationPlan?.length
    )
}

export const useInterview = () => {

    const context = useContext(InterviewContext)
    const { interviewId } = useParams()
    const location = useLocation()

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const { loading, setLoading, report, setReport, reports, setReports } = context

    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true)
        try {
            const response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile })
            setReport(response.interviewReport)
            return { success: true, data: response.interviewReport }
        } catch (error) {
            const message = error.response?.data?.message || error.message || "Failed to generate interview plan"
            console.error(message, error)
            return { success: false, error: message }
        } finally {
            setLoading(false)
        }
    }

    const getReportById = async (id) => {
        if (report?._id === id && hasReportContent(report)) {
            return report
        }

        setLoading(true)
        try {
            const response = await getInterviewReportById(id)
            setReport(response.interviewReport)
            return response.interviewReport
        } catch (error) {
            const message = error.response?.data?.message || error.message
            console.error(message, error)
            setReport(null)
            return null
        } finally {
            setLoading(false)
        }
    }

    const getReports = async () => {
        setLoading(true)
        try {
            const response = await getAllInterviewReports()
            setReports(response.interviewReports)
            return response.interviewReports
        } catch (error) {
            console.error(error)
            return []
        } finally {
            setLoading(false)
        }
    }

    const getResumePdf = async (interviewReportId) => {
        setLoading(true)
        try {
            const response = await generateResumePdf({ interviewReportId })
            const url = window.URL.createObjectURL(new Blob([ response ], { type: "application/pdf" }))
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", `resume_${interviewReportId}.pdf`)
            document.body.appendChild(link)
            link.click()
            link.remove()
            window.URL.revokeObjectURL(url)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (interviewId) {
            const stateReport = location.state?.report

            if (stateReport?._id === interviewId && hasReportContent(stateReport)) {
                setReport(stateReport)
                return
            }

            getReportById(interviewId)
        } else {
            getReports()
        }
    }, [ interviewId ])

    return { loading, report, reports, generateReport, getReportById, getReports, getResumePdf }
}

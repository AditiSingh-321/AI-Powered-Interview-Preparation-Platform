import { useContext, useEffect } from "react";
import { InterviewContext } from "../interview.context";
import { generateInterviewReport, getInterviewReportById as fetchReportById, getAllInterviewReports, generateResumePdf as fetchResumePdf } from "../services/interview.api";

export const useInterview = () => {
    const context = useContext(InterviewContext);
    const { loading, setLoading, report, setReport, reports, setReports } = context;

    const generateReport = async (formData) => {
        setLoading(true);
        try {
            const data = await generateInterviewReport(formData);
            setReport(data.interviewReport);
            return data.interviewReport;
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getReportById = async (id) => {
        setLoading(true);
        try {
            const data = await fetchReportById(id);
            setReport(data.interviewReport);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getResumePdf = async (id) => {
        try {
            const blob = await fetchResumePdf(id);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `resume_${id}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const data = await getAllInterviewReports();
                setReports(data.interviewReports);
            } catch (error) {}
        };
        fetchReports();
    }, []);

    return { loading, report, reports, generateReport, getReportById, getResumePdf };
}

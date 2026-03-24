import { useContext } from "react";
import {
  getAllInterviewReports,
  generateInterviewReport,
  getInterviewReportById,
  deleteReport
} from "../../services/interview.api";
import { InterviewContext } from "../interview.context";

export const useInterview = () => {
  const context = useContext(InterviewContext);

  if (!context) {
    throw new Error("useInterview must be used within an InterviewProvider");
  }

  const { loading, setLoading, report, setReport, reports, setReports } =
    context;

  // ✅ Generate Report
  const generateReport = async ({
    jobDescription,
    selfDescription,
    resumeFile,
  }) => {
    setLoading(true);

    try {
      const response = await generateInterviewReport({
        jobDescription,
        selfDescription,
        resumeFile,
      });

      const reportData = response?.interviewReport;

      if (!reportData) return null;

      setReport(reportData);
      return reportData._id;
    } catch (error) {
      console.log(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Get Single Report
  const getReportById = async (interviewId) => {
    setLoading(true);

    try {
      const response = await getInterviewReportById(interviewId);
      const reportData = response?.interviewReport;

      if (!reportData) return null;

      setReport(reportData);
      return reportData;
    } catch (error) {
      console.log(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Get All Reports (History)
  const getReports = async () => {
    setLoading(true);

    try {
      const response = await getAllInterviewReports();
      setReports(response.interviewReports || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReport = async (id) => {
  try {
    await deleteReport(id);
    getReports(); // refresh list
  } catch (error) {
    console.error("Delete failed");
  }
};

  return {
    loading,
    report,
    reports,
    generateReport,
    getReportById,
    getReports,
    handleDeleteReport
  };
};
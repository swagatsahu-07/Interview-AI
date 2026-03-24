const pdfParse = require("pdf-parse");
const generateInterviewReport = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");

/**
 * @description Generate an interview report based on candidate information
 */

async function generateInterviewController(req, res) {
  const resumeFile = req.file;

  const resumeContent = await new pdfParse.PDFParse(
    Uint8Array.from(req.file.buffer),
  ).getText();
  const { selfDescription, jobDescription } = req.body;

  const interviewReportByAi = await generateInterviewReport({
    resume: resumeContent.text,
    selfDescription,
    jobDescription,
  });

  const title =
    jobDescription.split("\n")[0]?.slice(0, 60) || "Interview Report";
  const interviewReport = await interviewReportModel.create({
    user: req.user.id,
    resume: resumeContent.text,
    title,
    selfDescription,
    jobDescription,
    ...interviewReportByAi,
  });

  res.status(201).json({
    messgae: "Interview report generated successfully",
    interviewReport,
  });
}

/*
 * @description Get interview report by interviewId
 */
async function getInterviewReportByIdController(req, res) {
  const { interviewId } = req.params;

  const interviewReport = await interviewReportModel.findOne({
    _id: interviewId,
    user: req.user.id,
  });

  if (!interviewReport) {
    return res.status(404).json({
      message: "Interview report not found",
      interviewReport,
    });
  }

  res.status(200).json({
    message: "Interview report fetched successfully",
    interviewReport,
  });
}

/**
 * @description Controller to get all the interview reports for the logged in user.
 */
async function getAllInterviewReportController(req, res) {
  const interviewReports = await interviewReportModel
    .find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .select(
      "-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan",
    );
  res.status(200).json({
    message: "Interview reports fetched successfully",
    interviewReports,
  });
}
/** * @description Controller to delete an interview report by id.
 */
const deleteInterviewReportController = async (req, res) => {
  try {
    const { id } = req.params;

    const interview = await interviewReportModel.findOne({
      _id: id,
      user: req.user.id,
    });

    if (!interview) {
      return res.status(404).json({
        message: "Interview not found or unauthorized",
      });
    }

    await interviewReportModel.findByIdAndDelete(id);

    res.status(200).json({
      message: "Interview deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  generateInterviewController,
  getInterviewReportByIdController,
  getAllInterviewReportController,
  deleteInterviewReportController,
};

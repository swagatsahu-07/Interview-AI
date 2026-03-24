import axios from "axios";


const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});


/**
 * 
 * @description Generate an interview report based on candidate information
 */
export const generateInterviewReport = async ({selfDescription, jobDescription, resumeFile}) => {
  const formData = new FormData();
  formData.append("selfDescription", selfDescription);
  formData.append("jobDescription", jobDescription);
  formData.append("resume", resumeFile);

  const response = await api.post("/api/interview/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}


/**
 * @description Get interview report by interviewId    
*/
export const getInterviewReportById = async (interviewId) => {
  const response = await api.get(`/api/interview/report/${interviewId}`);
  return response.data;
}

/**
 * @description Get all the interview reports for the logged in user.
 */
export const getAllInterviewReports = async () => {
  const response = await api.get("/api/interview/");
  return response.data;
}

/**
 * @description Delete an interview report by id. 
 */
export const deleteReport = async (id) => {
  const res = await api.delete(`/api/interview/${id}`);
  return res.data;
};
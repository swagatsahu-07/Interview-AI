import React, { useRef, useState, useEffect } from "react";
import "./styles/home.scss";
import { HiOutlineCloudUpload } from "react-icons/hi";
import { FiTrash2, FiMenu, FiX } from "react-icons/fi";
import { useInterview } from "../hooks/useInterview";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { useAuth } from "../hooks/useAuth";

const Home = () => {
  const { loading, generateReport, reports, getReports, handleDeleteReport } =
    useInterview();
  const { user, handleLogout } = useAuth();

  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const resumeInputRef = useRef(null);
  const navigate = useNavigate();
  const userName = user?.userName || "User";

  useEffect(() => {
    getReports();
  }, []);

  const onLogout = async () => {
    await handleLogout();
    navigate("/login");
  };

  const handleGenerateReport = async () => {
    setError("");
    const resumeFile = resumeInputRef.current?.files[0];
    if (!jobDescription.trim()) return setError("Job description is required");
    if (!resumeFile) return setError("Please upload your resume");
    if (resumeFile.type !== "application/pdf")
      return setError("Only PDF files are allowed");
    if (resumeFile.size > 3 * 1024 * 1024)
      return setError("File size should be less than 3MB");
    const id = await generateReport({
      jobDescription,
      selfDescription,
      resumeFile,
    });
    if (id) navigate(`/interview/${id}`);
    else setError("Failed to generate interview report");
  };

  if (loading) return <Loader text="Generating report..." />;

  return (
    // data-page="home" scopes ALL CSS in home.scss so interview.scss rules can never bleed in
    <div data-page="home" className="homeLayout">
      {/* OVERLAY */}
      <div
        className={`homeOverlay ${sidebarOpen ? "homeOverlay--visible" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* HAMBURGER */}
      <button
        className="homeHamburger"
        onClick={() => setSidebarOpen((p) => !p)}
        aria-label="Toggle sidebar"
      >
        <FiMenu />
      </button>

      {/* SIDEBAR */}
      <aside
        className={`homeSidebar ${sidebarOpen ? "homeSidebar--open" : ""}`}
      >
        <button
          className="homeSidebarClose"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        >
          <FiX />
        </button>

        <h3>Interview AI</h3>

        <div className="homeSidebarHistory">
          {reports.length === 0 ? (
            <p className="homeSidebarEmpty">No reports</p>
          ) : (
            reports.map((report) => (
              <div key={report._id} className="homeSidebarItem">
                <span
                  className="homeSidebarTitle"
                  onClick={() => {
                    navigate(`/interview/${report._id}`);
                    setSidebarOpen(false);
                  }}
                >
                  {report.title}
                </span>
                <FiTrash2
                  className="homeSidebarDelete"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteReport(report._id);
                  }}
                />
              </div>
            ))
          )}
        </div>

        <div className="homeSidebarTopBar">
          <span>
            Hi, <strong>{userName}</strong>
          </span>
          <button className="homeSidebarLogout" onClick={onLogout}>
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="homeMain">
        <div className="homeContainer">
          <div className="homeHeader">
            <p className="homeQuote">
              Hello {userName}, which role are you preparing for today?
            </p>
          </div>

          <div className="homeCard">
            {/* LEFT */}
            <div className="homeLeft">
              <div className="homeSectionTitle">
                Target Job Description <span className="homeRequired">*</span>
              </div>
              <textarea
                className="homeTextarea homeTextarea--tall"
                value={jobDescription}
                placeholder="Paste the full job description here..."
                onChange={(e) => setJobDescription(e.target.value)}
              />
              <p className="homeHelper">
                Report generation may take up to 30 seconds. Please be patient.
              </p>
            </div>

            {/* RIGHT */}
            <div className="homeRight">
              <div className="homeSectionTitle">Your Profile</div>

              <label htmlFor="resume" className="homeUploadBox">
                <HiOutlineCloudUpload className="homeUploadIcon" />
                {fileName ? (
                  <>
                    <p className="homeFileName">{fileName}</p>
                    <small>Click to change file</small>
                  </>
                ) : (
                  <>
                    <p>Click to upload or drag & drop</p>
                    <small>PDF Only (Max 3MB)</small>
                  </>
                )}
              </label>

              <input
                type="file"
                id="resume"
                ref={resumeInputRef}
                style={{ display: "none" }}
                accept=".pdf"
                onChange={(e) => {
                  const f = e.target.files[0];
                  if (f) setFileName(f.name);
                }}
              />

              <textarea
                className="homeTextarea homeTextarea--short"
                value={selfDescription}
                placeholder="Briefly describe your experience, skills..."
                onChange={(e) => setSelfDescription(e.target.value)}
              />

              <div className="homeNote">
                Using resume and self description both improves results
              </div>

              {error && <p className="homeError">{error}</p>}

              <button
                className="homeGenerateBtn"
                onClick={handleGenerateReport}
              >
                Generate My Interview Strategy
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;

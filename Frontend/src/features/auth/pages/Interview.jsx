import React, { useState, useEffect } from "react";
import "./styles/interview.scss";
import { useInterview } from "../hooks/useInterview";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../components/Loader";

const Interview = () => {
  const [activeTab, setActiveTab] = useState("technical");
  const [animatedScore, setAnimatedScore] = useState(0);
  const [showRightPanel, setShowRightPanel] = useState(false);

  const navigate = useNavigate();

  const { report, getReportById, loading } = useInterview();
  const { interviewId } = useParams();

  useEffect(() => {
    if (interviewId) {
      getReportById(interviewId);
    }
  }, [interviewId]);

  const score = report?.matchScore ?? 0;

  useEffect(() => {
    let start = 0;
    const duration = 800;
    const stepTime = 10;
    const increment = score / (duration / stepTime);

    const counter = setInterval(() => {
      start += increment;
      if (start >= score) {
        setAnimatedScore(score);
        clearInterval(counter);
      } else {
        setAnimatedScore(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(counter);
  }, [score]);

  const getScoreClass = () => {
    if (score <= 40) return "low";
    if (score <= 70) return "medium";
    return "high";
  };

  const getScoreText = () => {
    if (score <= 40) return "Low match for this role";
    if (score <= 70) return "Moderate match for this role";
    return "Strong match for this role";
  };

  if (loading || !report) {
    return <Loader text="Generating report..." />;
  }

  return (
    <div className="interview">

      {/* MOBILE TOP BAR */}
      <div className="mobileTopBar">
        <button className="backBtnMobile" onClick={() => navigate("/home")}>
          ← Home
        </button>
        <h1 className="mobileTitle">Interview Prep</h1>
        <button
          className={`scoreToggleBtn ${getScoreClass()}`}
          onClick={() => setShowRightPanel(!showRightPanel)}
        >
          {animatedScore}%
        </button>
      </div>

      {/* MOBILE TAB BAR */}
      <div className="mobileTabBar">
        <button
          className={activeTab === "technical" ? "active" : ""}
          onClick={() => setActiveTab("technical")}
        >
          Technical
        </button>
        <button
          className={activeTab === "behavioral" ? "active" : ""}
          onClick={() => setActiveTab("behavioral")}
        >
          Behavioral
        </button>
        <button
          className={activeTab === "roadmap" ? "active" : ""}
          onClick={() => setActiveTab("roadmap")}
        >
          Roadmap
        </button>
      </div>

      {/* LEFT SIDEBAR (tablet/desktop) */}
      <div className="sidebar">
        <h4>SECTIONS</h4>

        <p
          className={activeTab === "technical" ? "active" : ""}
          onClick={() => setActiveTab("technical")}
        >
          Technical Questions
        </p>

        <p
          className={activeTab === "behavioral" ? "active" : ""}
          onClick={() => setActiveTab("behavioral")}
        >
          Behavioral Questions
        </p>

        <p
          className={activeTab === "roadmap" ? "active" : ""}
          onClick={() => setActiveTab("roadmap")}
        >
          Road Map
        </p>

        <div className="bottomNav">
          <button className="backBtn" onClick={() => navigate("/home")}>
            ← Go to Home
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="content">
        <div className="contentHeader">
          <h2>
            {activeTab === "technical" && "Technical Questions"}
            {activeTab === "behavioral" && "Behavioral Questions"}
            {activeTab === "roadmap" && "Preparation Roadmap"}
          </h2>
          {/* Score summary inline for tablet/desktop — hidden on mobile */}
          <div className={`inlineScore ${getScoreClass()}`}>
            <span className="inlineScoreNum">{animatedScore}%</span>
            <span className="inlineScoreLabel">{getScoreText()}</span>
          </div>
        </div>

        {activeTab === "technical" &&
          (report?.technicalQuestions || []).map((item, i) => (
            <div key={i} className="card">
              <div className="questionRow">
                <span className="badge">Q{i + 1}</span>
                <p>{item.question}</p>
              </div>
              <div className="tag purple">INTENTION</div>
              <p className="intentionText">{item.intention}</p>
              <div className="tag green">MODEL ANSWER</div>
              <p className="answerText">{item.answer}</p>
            </div>
          ))}

        {activeTab === "behavioral" &&
          (report?.behavioralQuestions || []).map((item, i) => (
            <div key={i} className="card">
              <div className="questionRow">
                <span className="badge">Q{i + 1}</span>
                <p>{item.question}</p>
              </div>
              <div className="tag purple">INTENTION</div>
              <p className="intentionText">{item.intention}</p>
              <div className="tag green">MODEL ANSWER</div>
              <p className="answerText">{item.answer}</p>
            </div>
          ))}

        {activeTab === "roadmap" &&
          (report?.preparationPlan || []).map((day, i) => (
            <div key={i} className="card">
              <div className="questionRow">
                <span className="badge">Day {day.day}</span>
                <p>{day.focus}</p>
              </div>
              <ul className="roadmapList">
                {day.tasks?.map((task, idx) => (
                  <li key={idx}>{task}</li>
                ))}
              </ul>
            </div>
          ))}
      </div>

      {/* RIGHT PANEL — slides in on mobile, always visible on desktop */}
      <div className={`rightPanel ${showRightPanel ? "open" : ""}`}>
        {/* Mobile close button */}
        <button className="closePanel" onClick={() => setShowRightPanel(false)}>
          ✕
        </button>

        <div className="scoreBox">
          <h4>Match Score</h4>
          <div className={`circle ${getScoreClass()}`}>
            <span>{animatedScore}%</span>
          </div>
          <p className={`scoreText ${getScoreClass()}`}>{getScoreText()}</p>
        </div>

        <div className="skills">
          <h4>Skill Gaps</h4>
          {(report?.skillGaps || []).map((item, i) => (
            <div key={i} className={`skill ${item.severity}`}>
              {item.skill}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile overlay when right panel is open */}
      {showRightPanel && (
        <div className="overlay" onClick={() => setShowRightPanel(false)} />
      )}
    </div>
  );
};

export default Interview;
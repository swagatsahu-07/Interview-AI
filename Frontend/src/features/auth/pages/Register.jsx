import React, { useState } from 'react'
import '../auth.form.scss'
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import Loader from '../components/Loader';

const Register = () => {
  const navigate = useNavigate();
  const { loading, handleRegister } = useAuth();
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

 const handleSubmit = async (e) => {
  e.preventDefault();
  const result = await handleRegister({ userName, email, password });
  if (result.success) {
    navigate('/home');
  } else {
    setError(result.message);
  }
};

  if (loading) return <Loader text="Loading..." />;

  return (
    <main>
      <div className="authBg">
        <div className="authBgGrid" />
        <div className="authBgGlow" />
        <div className="tipsCarousel">
          <div className="tipsTrack">
            {[
              { icon: "🎯", tip: "Tailor every answer to the job description" },
              { icon: "⚡", tip: "Use the STAR method for behavioral questions" },
              { icon: "🧠", tip: "Research the company before every interview" },
              { icon: "💬", tip: "Ask thoughtful questions — it shows curiosity" },
              { icon: "📊", tip: "Quantify your achievements with real numbers" },
              { icon: "🚀", tip: "Practice out loud, not just in your head" },
              { icon: "🤝", tip: "Body language is 55% of your first impression" },
              { icon: "🎯", tip: "Tailor every answer to the job description" },
              { icon: "⚡", tip: "Use the STAR method for behavioral questions" },
              { icon: "🧠", tip: "Research the company before every interview" },
              { icon: "💬", tip: "Ask thoughtful questions — it shows curiosity" },
              { icon: "📊", tip: "Quantify your achievements with real numbers" },
              { icon: "🚀", tip: "Practice out loud, not just in your head" },
              { icon: "🤝", tip: "Body language is 55% of your first impression" },
            ].map((item, i) => (
              <div className="tipCard" key={i}>
                <span className="tipIcon">{item.icon}</span>
                <span className="tipText">{item.tip}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="authHero">
          <div className="authHeroBadge">AI-Powered Interview Prep</div>
          <h2 className="authHeroTitle">Your Dream Job<br /><span>Starts Here</span></h2>
          <p className="authHeroSub">Upload your resume, paste the JD, and get a complete interview strategy tailored just for you.</p>
        </div>
      </div>

      {/* Form */}
      <div className="formContainer">
        <h1>Create account</h1>

        <form onSubmit={handleSubmit}>
          <div className="inputGroup">
            <label htmlFor="userName">Username</label>
            <input
              type="text"
              id="userName"
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter Username"
              required
            />
          </div>
          <div className="inputGroup">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your mail"
              required
            />
          </div>
          <div className="inputGroup">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          {error && <p style={{ color: "red", fontSize: "14px" }}>{error}</p>}
          <button className="button primaryButton" type="submit">Register</button>
          <p>Already have an account? <Link to="/login">Login Here</Link></p>
        </form>
      </div>
    </main>
  );
};

export default Register;
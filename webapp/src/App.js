import React, { useState } from "react";
import axios from "axios";
import "./App.css";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

const BASE_URL = "http://127.0.0.1:8000"; // 🔥 change when deploying

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const [role, setRole] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);

  const [page, setPage] = useState("dashboard");
  const [loading, setLoading] = useState(false);

  // 🎤 Voice Input
  const startListening = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition not supported in this browser");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const speechText = event.results[0][0].transcript;
      setAnswer(speechText);
    };

    recognition.start();
  };

  // Resume Upload
  const handleUpload = async () => {
    if (!file) return alert("Please upload a file");

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(`${BASE_URL}/analyze`, formData);
      setResult(res.data);
    } catch (err) {
      alert("Error analyzing resume");
    } finally {
      setLoading(false);
    }
  };

  // Generate Questions
  const generateQuestions = async () => {
    if (!role) return alert("Enter role");

    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/questions`, {
        params: { role },
      });
      setQuestions(res.data.questions);
    } catch {
      alert("Error generating questions");
    } finally {
      setLoading(false);
    }
  };

  // Evaluate Answer
  const evaluateAnswer = async () => {
    if (!answer) return alert("Write or speak answer");

    try {
      setLoading(true);
      const res = await axios.post(`${BASE_URL}/evaluate`, {
        question: questions.join("\n"),
        answer: answer,
      });
      setFeedback(res.data.feedback);
    } catch {
      alert("Error evaluating answer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">

      {/* Sidebar */}
      <div className="sidebar">
        <h2>🚀 AI Coach</h2>

        <p onClick={() => setPage("dashboard")}>Dashboard</p>
        <p onClick={() => setPage("resume")}>Resume</p>
        <p onClick={() => setPage("interview")}>Interview</p>
      </div>

      {/* Main */}
      <div className="main">

        {/* Header */}
        <div className="header">
          Smart Resume Analyzer + Interview Coach
        </div>

        <div className="cards">

          {/* DASHBOARD */}
          {page === "dashboard" && (
            <motion.div
              className="card"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h2>Welcome 🚀</h2>
              <p>Your AI-powered career assistant</p>
            </motion.div>
          )}

          {/* RESUME */}
          {page === "resume" && (
            <motion.div className="card" whileHover={{ scale: 1.03 }}>
              <h3>📄 Resume Analyzer</h3>

              <input type="file" onChange={(e) => setFile(e.target.files[0])} />

              <button onClick={handleUpload}>
                {loading ? "Analyzing..." : "Analyze Resume"}
              </button>

              {result && (
                <>
                  <h4>Score: {result.score}%</h4>

                  {/* Chart */}
                  <PieChart width={250} height={250}>
                    <Pie
                      data={[
                        { name: "Matched", value: result.score },
                        { name: "Missing", value: 100 - result.score }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      dataKey="value"
                    >
                      <Cell fill="#22c55e" />
                      <Cell fill="#ef4444" />
                    </Pie>
                    <Tooltip />
                  </PieChart>

                  <div className="progress">
                    <div
                      className="progress-bar"
                      style={{ width: `${result.score}%` }}
                    ></div>
                  </div>

                  <h4>Skills</h4>
                  <div className="skills">
                    {result.skills.map((s, i) => (
                      <span key={i} className="skill">{s}</span>
                    ))}
                  </div>

                  <h4>Missing</h4>
                  <div className="skills">
                    {result.missing.map((s, i) => (
                      <span key={i} className="missing">{s}</span>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          )}

          {/* INTERVIEW */}
          {page === "interview" && (
            <motion.div className="card" whileHover={{ scale: 1.03 }}>
              <h3>🎤 Mock Interview</h3>

              <input
                placeholder="Enter Role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />

              <button onClick={generateQuestions}>
                {loading ? "Generating..." : "Generate Questions"}
              </button>

              {questions.map((q, i) => (
                <p key={i}>• {q}</p>
              ))}

              {/* 🎤 Voice Button */}
              <button onClick={startListening}>
                🎤 Speak Answer
              </button>

              <textarea
                placeholder="Write or speak your answer..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />

              <button onClick={evaluateAnswer}>
                {loading ? "Evaluating..." : "Evaluate Answer"}
              </button>

              {feedback && (
                <div className="feedback">
                  <h4>🧠 Feedback</h4>
                  <p><b>Score:</b> {feedback.score}</p>
                  <p>{feedback.feedback}</p>
                </div>
              )}
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
}

export default App;
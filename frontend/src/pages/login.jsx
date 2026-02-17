import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      });

      const { token } = response.data;
      localStorage.setItem("token", token);

      setLoading(false);
      alert("Login successful !");
      navigate("/Home");
    } catch (err) {
      setLoading(false);
      if (err.response && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  //  Styles inline bleu dark prestige
  const styles = {
    page: {
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "#0B1C2D",
      padding: "20px",
    },
    title: {
      fontSize: "36px",
      color: "#EAF2FF",
      marginBottom: "40px",
      fontFamily: "'Playfair Display', serif",
    },
    card: {
      background: "#0E2438",
      padding: "32px",
      borderRadius: "16px",
      width: "100%",
      maxWidth: "420px",
      boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
      display: "flex",
      flexDirection: "column",
      gap: "15px",
    },
    input: {
      width: "100%",
      padding: "18px",
      borderRadius: "14px",
      border: "1px solid #1E3A5F",
      background: "linear-gradient(180deg, #0B1C2D, #0E2438)",
      color: "#EAF2FF",
      fontSize: "16px",
      lineHeight: "1.8",
      outline: "none",
    },
    inputPlaceholder: {
      color: "#8FB3E0",
    },
    button: {
      width: "100%",
      padding: "12px",
      borderRadius: "14px",
      border: "none",
      background: "linear-gradient(135deg, #3B82F6, #2563EB)",
      color: "#EAF2FF",
      fontWeight: 600,
      cursor: "pointer",
      fontSize: "16px",
      transition: "all 0.3s ease",
    },
    error: {
      color: "#EF4444",
      textAlign: "center",
    },
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Blog Platform</h1>
      <form onSubmit={handleSubmit} style={styles.card}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        {error && <p style={styles.error}>{error}</p>}
      </form>
    </div>
  );
};

export default Login;

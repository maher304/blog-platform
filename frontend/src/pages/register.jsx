import React, { useState } from "react";
import { Link } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const result = await res.json();
      if (res.status === 201) alert(result.message);
      else alert(result.error);
    } catch (err) {
      alert("Erreur serveur: " + err.message);
    }
  };

  // ✅ Styles inline directement dans le composant
  const styles = {
    page: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#0B1C2D",
      padding: "20px",
    },
    card: {
      background: "#0E2438",
      padding: "32px",
      borderRadius: "16px",
      width: "100%",
      maxWidth: "420px",
      boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
      color: "#EAF2FF",
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
    link: {
      color: "#3B82F6",
      textDecoration: "underline",
    },
  };

  return (
    <div style={styles.page}>
      <form style={styles.card} onSubmit={handleRegister}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Register</h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={styles.input}
        />

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

        <button type="submit" style={styles.button}>
          S'inscrire
        </button>

        <p style={{ textAlign: "center" }}>
          Déjà un compte ?{" "}
          <Link to="/login" style={styles.link}>
            Connectez-vous
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;

import React, { useState } from "react";
import { Link } from "react-router-dom";

const Register =()=> {
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

  return (
    <form onSubmit={handleRegister}>
      <h2>Register</h2>
      <input type="text" placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} required />
      <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
      <button type="submit">S'inscrire</button>
       <p>
          Déjà un compte ?{" "}
          <Link to="/login" style={{ color: "blue", textDecoration: "underline" }}>
            Connectez-vous
          </Link>
        </p>
    </form>
  );
}
export default Register;
import React, { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";

const Account = () => {
  const [username, setUsername] = useState("");
  const [posts, setPosts] = useState([]);

  // 🔹 Récupérer les posts du compte connecté
  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch("http://localhost:5000/api/postsaccount", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (Array.isArray(data)) {
        const postsWithEditing = data.map(p => ({ ...p, editing: false }));
        setPosts(postsWithEditing);

        if (data.length > 0 && data[0].author) {
          setUsername(data[0].author.username);
        }
      }
    } catch (error) {
      console.error("Erreur fetch posts :", error);
    }
  };

  const handleEdit = (id) => {
    setPosts(posts.map(p => p._id === id ? { ...p, editing: true } : p));
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`http://localhost:5000/api/posts/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200) alert("Post supprimé avec succès !");
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleCancel = (id) => {
    setPosts(posts.map(p => p._id === id ? { ...p, editing: false } : p));
  };

  const handleEditChange = (id, field, value) => {
    setPosts(posts.map(p => p._id === id ? { ...p, [field]: value } : p));
  };

  const handleSave = async (postId, title, content) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`http://localhost:5000/api/posts/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      });

      if (res.status === 200) {
        alert("Post modifié avec succès !");
        setPosts(posts.map(p => p._id === postId ? { ...p, title, content, editing: false } : p));
      }
    } catch (err) {
      alert("Erreur serveur : " + err.message);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // 🔹 Styles inline bleu dark prestige
  const styles = {
    page: {
      minHeight: "100vh",
      background: "#0B1C2D",
      color: "#EAF2FF",
      padding: "30px",
      fontFamily: "'Inter', sans-serif",
    },
    header: {
      display: "flex",
      alignItems: "center",
      gap: "15px",
      marginBottom: "30px",
    },
    username: {
      fontSize: "24px",
      fontWeight: 700,
    },
    postCard: {
      background: "#0E2438",
      borderRadius: "14px",
      padding: "20px",
      marginBottom: "15px",
      boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
    },
    input: {
      width: "100%",
      padding: "18px",
      marginBottom: "10px",
      borderRadius: "14px",
      border: "1px solid #1E3A5F",
      background: "linear-gradient(180deg, #0B1C2D, #0E2438)",
      color: "#EAF2FF",
      fontSize: "16px",
      lineHeight: 1.8,
      outline: "none",
    },
    textarea: {
      width: "100%",
      padding: "18px",
      marginBottom: "10px",
      borderRadius: "14px",
      border: "1px solid #1E3A5F",
      background: "linear-gradient(180deg, #0B1C2D, #0E2438)",
      color: "#EAF2FF",
      fontSize: "16px",
      lineHeight: 1.8,
      minHeight: "80px",
      resize: "vertical",
      outline: "none",
    },
    btnEdit: {
      padding: "10px 16px",
      borderRadius: "12px",
      border: "none",
      background: "linear-gradient(135deg, #3B82F6, #2563EB)",
      color: "#EAF2FF",
      fontWeight: 600,
      cursor: "pointer",
      marginRight: "8px",
    },
    btnDelete: {
      padding: "10px 16px",
      borderRadius: "12px",
      border: "none",
      background: "linear-gradient(135deg, #EF4444, #B91C1C)",
      color: "#fff",
      fontWeight: 600,
      cursor: "pointer",
    },
    btnSave: {
      padding: "10px 16px",
      borderRadius: "12px",
      border: "none",
      background: "linear-gradient(135deg, #10B981, #047857)",
      color: "#fff",
      fontWeight: 600,
      cursor: "pointer",
      marginRight: "8px",
    },
    btnCancel: {
      padding: "10px 16px",
      borderRadius: "12px",
      border: "none",
      background: "linear-gradient(135deg, #6B7280, #4B5563)",
      color: "#fff",
      fontWeight: 600,
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <FaUserCircle size={50} />
        <h2 style={styles.username}>{username}</h2>
      </div>

      {/* Liste des posts */}
      {posts.length > 0 ? posts.map(post => (
        <div key={post._id} style={styles.postCard}>
          {post.editing ? (
            <>
              <input
                type="text"
                value={post.title}
                placeholder="Titre"
                style={styles.input}
                onChange={e => handleEditChange(post._id, "title", e.target.value)}
              />
              <textarea
                value={post.content}
                placeholder="Contenu"
                style={styles.textarea}
                onChange={e => handleEditChange(post._id, "content", e.target.value)}
              />
              <button style={styles.btnSave} onClick={() => handleSave(post._id, post.title, post.content)}>Sauvegarder</button>
              <button style={styles.btnCancel} onClick={() => handleCancel(post._id)}>Annuler</button>
            </>
          ) : (
            <>
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              <button style={styles.btnEdit} onClick={() => handleEdit(post._id)}>Modifier</button>
              <button style={styles.btnDelete} onClick={() => handleDelete(post._id)}>Supprimer</button>
            </>
          )}
        </div>
      )) : (
        <p>Aucun post pour le moment.</p>
      )}
    </div>
  );
};

export default Account;

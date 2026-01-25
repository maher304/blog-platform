import React, { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";

const Home = () => {
  const [username, setUsername] = useState("");
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState([]);

  // Récupérer username depuis le token stocké
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // JWT simple decode pour extraire le username ou email
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUsername(payload.email); // ou payload.id selon ce que tu as mis dans JWT
    }
    fetchPosts();
  }, []);

  // Fonction pour récupérer tous les posts
  const fetchPosts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/posts");
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fonction pour partager un post
  const handleShare = async () => {
    if (!content.trim()) return alert("Écrivez quelque chose !");
    try {
      const token = localStorage.getItem("token");
      const payload = JSON.parse(atob(token.split(".")[1]));

      const res = await fetch("http://localhost:5000/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Post", // tu peux ajouter un champ title si besoin
          content,
          authorId: payload.id, // id de l'utilisateur connecté
        }),
      });

      const result = await res.json();
      if (res.status === 201) {
        alert("Post partagé !");
        setContent(""); // vider textarea
        fetchPosts(); // recharger les posts
      } else {
        alert(result.error);
      }
    } catch (err) {
      alert("Erreur serveur: " + err.message);
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <FaUserCircle size={50} />
        <span style={styles.username}>{username}</span>
      </div>

      {/* Create Post */}
      <div style={styles.createPost}>
        <textarea
          placeholder="Écrivez quelque chose..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={styles.textarea}
        />
        <button onClick={handleShare} style={styles.button}>
          Partager
        </button>
      </div>

      {/* Posts List */}
      <div style={styles.postsList}>
        {posts.map((post) => (
          <div key={post._id} style={styles.post}>
            <strong>{post.author.username}</strong>
            <p>{post.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: "600px", margin: "0 auto", padding: "20px" },
  header: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" },
  username: { fontSize: "20px", fontWeight: "bold" },
  createPost: { display: "flex", flexDirection: "column", gap: "10px", marginBottom: "30px" },
  textarea: { width: "100%", height: "80px", padding: "10px", fontSize: "16px" },
  button: { padding: "10px", fontSize: "16px", cursor: "pointer" },
  postsList: { display: "flex", flexDirection: "column", gap: "15px" },
  post: { border: "1px solid #ccc", padding: "10px", borderRadius: "8px" },
};

export default Home;

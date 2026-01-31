import React, { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

const Home = () => {
  const [username, setUsername] = useState("");
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
   

  // Fonction pour récupérer tous les posts (définie en dehors de useEffect)
  const fetchPosts = async (token) => {
    try {
      const res = await fetch("http://localhost:5000/api/posts", {
        headers: { "Authorization": `Bearer ${token}` },
      });
      const data = await res.json();
      setPosts(data);
      return data; // si besoin
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/login";
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/home", {
          headers: { "Authorization": `Bearer ${token}` },
        });

        if (res.status === 200) {
          const data = await res.json();
          setUsername(data.user.email);
          await fetchPosts(token); // ici ok maintenant
          setLoading(false);
        } else {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
      } catch (err) {
        console.error("Erreur auth:", err);
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    };

    checkAuth();
  }, []);

  // Fonction pour partager un post
  const handleShare = async () => {
    if (!content.trim()) return alert("Écrivez quelque chose !");
    try {
      const token = localStorage.getItem("token");
      const payload = JSON.parse(atob(token.split(".")[1]));

      const res = await fetch("http://localhost:5000/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: "Post",
          content,
          authorId: payload.id,
        }),
      });

      const result = await res.json();
      if (res.status === 201) {
        alert("Post partagé !");
        setContent(""); 
        await fetchPosts(token); // recharger les posts
      } else {
        alert(result.error);
      }
    } catch (err) {
      alert("Erreur serveur: " + err.message);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={styles.container}>
      {/* Header */}
      <Link to="/account" style={{ textDecoration: "none", color: "inherit" }}>
       <div style={styles.header}>
    <FaUserCircle size={50} />
        <span style={styles.username}>{username}</span>
       
      
      </div>
      </Link>
     

      {/* Create Post */}
      <div style={styles.createPost}>
        <textarea
        className="editor-blue"
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
        {Array.isArray(posts) && posts.map((post) => (
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
   textarea: {
    width: "100%",
    height: "80px",
    padding: "18px",
    fontSize: "16px",

    background: "linear-gradient(180deg, #0B1C2D, #0E2438)", // fond bleu dark
    color: "#EAF2FF",                                       // texte clair
    border: "1px solid #1E3A5F",                            // bord bleu sombre
    borderRadius: "14px",
    lineHeight: "1.8",
    resize: "vertical"
  },
  button: {
  padding: "12px",
  fontSize: "16px",
  cursor: "pointer",

  background: "linear-gradient(135deg, #3B82F6, #2563EB)", // bleu gradient
  color: "#EAF2FF", // texte clair
  border: "none",
  borderRadius: "12px",

  fontWeight: 600,
  transition: "all 0.3s ease", // transition pour hover
},
  postsList: { display: "flex", flexDirection: "column", gap: "15px" },
  post: { border: "1px solid #ccc", padding: "10px", borderRadius: "8px" },
};

export default Home;




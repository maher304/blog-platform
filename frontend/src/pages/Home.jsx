import React, { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

const Home = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState({});
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePostComments, setActivePostComments] = useState(null);
  const [commentText, setCommentText] = useState({});
  const currentUserId = localStorage.getItem("userId");

  const getProfileColor = (badge) => {
  switch(badge) {
    case "diamant": return  "#5D1049";
    case "gold": return "gold";
    case "argent": return "silver";
    case "bronze": return "#cd7f32";
    default: return "#ffffff";
  }
};

  const fetchPosts = async (token) => {
    try {
      const res = await fetch("http://localhost:5000/api/posts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) return window.location.href = "/login";

      try {
        const res = await fetch("http://localhost:5000/api/home", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 200) {
          const data = await res.json();
          setUsername(data.user.email);
          setUser({ ...data.user });
          await fetchPosts(token);
          setLoading(false);
        } else {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
      } catch (err) {
        console.error(err);
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    };
    checkAuth();
  }, []);

  const handleShare = async () => {
    if (!content.trim()) return alert("Écrivez quelque chose !");
    try {
      const token = localStorage.getItem("token");
      const payload = JSON.parse(atob(token.split(".")[1]));
      const res = await fetch("http://localhost:5000/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title: "Post", content, authorId: payload.id }),
      });
      const result = await res.json();
      if (res.status === 201) {
        alert("Post partagé !");
        setContent(""); 
        await fetchPosts(token);
      } else alert(result.error);
    } catch (err) {
      alert("Erreur serveur: " + err.message);
    }
  };

  const onLike = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:5000/api/posts/${postId}/like`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchPosts(token);
    } catch (err) {
      console.error(err);
    }
  };

 const onComment = async (postId, text) => {
  if (!text.trim()) return alert("Écrivez un commentaire !");
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:5000/api/posts/${postId}/comment`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ text }),
    });
    const data = await res.json();
    return data; // <-- renvoie le post mis à jour
  } catch (err) {
    console.error(err);
  }
};

  if (loading) return <div>Loading...</div>;

  return (
    <div style={styles.container}>
    {/* Colonne de gauche : profile + create post */}
    <div style={styles.leftColumn}>
      <Link to="/account" style={{ textDecoration: "none", color: "inherit" }}>
        <div style={{ position: "relative", display: "inline-block" }}>
  <FaUserCircle size={60} color={getProfileColor(user.badge)} />
  {/* Badge optionnel */}
  {user.score >= 50 && (
    <span style={{
      position: "absolute",
      top: 0,
      right: 0,
      fontSize: "16px"
    }}>
      
    </span>
  )}
   {/* Nom de l’utilisateur sous l’icône */}
    <div style={{ marginTop: 8, color: "#EAF2FF", fontWeight: "bold" }}>
      {user.username || user.email}
    </div>
</div>
      </Link>

      <div style={styles.createPost}>
        <textarea
          placeholder="Écrivez quelque chose..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={styles.textarea}
        />
        <button onClick={handleShare} style={styles.button}>Partager</button>
      </div>
    </div>

    {/* Colonne de droite : liste des posts */}
    <div style={styles.rightColumn}>
      {Array.isArray(posts) && posts.map((post) => (
        <div key={post._id} style={styles.post}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
 <FaUserCircle size={30} color={getProfileColor(post.author.badge)} />
<span>{post.author.username}</span>
  {post.author.score >= 50 && (
    <span style={{ fontSize: "14px" }}>
      
    </span>
  )}
</div>
          <p>{post.content}</p>

          {/* Like & Comment buttons */}
          <div style={styles.buttonsContainer}>
            <button
              style={styles.likeButton}
              onClick={() => onLike(post._id)}
            >
              {post.likes.includes(currentUserId) ? "💖" : "🤍"} {post.likes.length}
            </button>

            <button
              style={styles.commentButton}
              onClick={() => setActivePostComments(post)}
            >
              💬 Commenter
            </button>
          </div>
        </div>
      ))}
    </div>

      {/* Modal commentaires */}
      {activePostComments && (
        <div style={styles.modalOverlay} onClick={() => setActivePostComments(null)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h3>Commentaires</h3>
            <div style={styles.modalComments}>
              {activePostComments.comments.map((comment, idx) => (
  <p key={idx}>
    <FaUserCircle size={20} color={getProfileColor(comment.user.badge)} style={{ marginRight: "5px" }} />
    <strong>{comment.user.username}:</strong> {comment.text}
  </p>
))}
            </div>

            {/* Champ de commentaire moderne */}
            <div style={styles.modalInputContainer}>
              <input
                type="text"
                placeholder="Écrire un commentaire..."
                value={commentText[activePostComments._id] || ""}
                onChange={(e) =>
                  setCommentText((prev) => ({ ...prev, [activePostComments._id]: e.target.value }))
                }
                style={styles.commentInput}
                onFocus={(e) => e.currentTarget.style.boxShadow = "0 0 8px rgba(59,130,246,0.4)"}
                onBlur={(e) => e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.1)"}
              />
              <button
                style={styles.commentButtonModal}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.05)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}
                onClick={async () => {
    await onComment(activePostComments._id, commentText[activePostComments._id]);
    setCommentText((prev) => ({ ...prev, [activePostComments._id]: "" }));
    await fetchPosts(localStorage.getItem("token")); // recharge les posts
    setActivePostComments(null); // ferme le modal
  }}
              >
                Envoyer
              </button>
            </div>

            <button style={styles.modalCloseButton} onClick={() => setActivePostComments(null)}>✖</button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "row", // ligne horizontale
    alignItems: "flex-start", // commencer en haut
    padding: "20px",
    width: "100%",
    minHeight: "100vh",
    boxSizing: "border-box",
    gap: "20px"
  },
  leftColumn: {
    width: "30%",         // 30% pour profile + create post
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  rightColumn: {
    width: "70%",         // 70% pour posts
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    alignItems: "center", // posts centrés horizontalement
  },
  createPost: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  textarea: {
    width: "100%",
    height: "80px",
    padding: "18px",
    fontSize: "16px",
    background: "linear-gradient(180deg, #0B1C2D, #0E2438)",
    color: "#EAF2FF",
    border: "1px solid #1E3A5F",
    borderRadius: "14px",
    lineHeight: "1.8",
    resize: "vertical",
  },
  button: {
    padding: "12px",
    fontSize: "16px",
    cursor: "pointer",
    background: "linear-gradient(90deg, #3B82F6, #092f82)",
    color: "#EAF2FF",
    border: "none",
    borderRadius: "12px",
    fontWeight: 600,
    transition: "all 0.3s ease",
  },
  post: {
    border: "1px solid #ccc",
    padding: "20px",
    borderRadius: "12px",
    width: "100%",       // prend toute la largeur de rightColumn
    maxWidth: "600px",
    fontSize: "16px",
  },
  buttonsContainer: { display: "flex", gap: "12px", marginTop: "10px" },
  likeButton: {
    cursor: "pointer",
    padding: "8px 16px",
    borderRadius: "20px",
    border: "none",
    background: "linear-gradient(135deg, #3B0A0A, #6B1B1B)",
    color: "#fff",
    fontWeight: "bold",
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  commentButton: {
    cursor: "pointer",
    padding: "8px 16px",
    borderRadius: "20px",
    border: "none",
    background: "linear-gradient(135deg, #1d9672, #0B3D2E)",
    color: "#fff",
    fontWeight: "bold",
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  modalOverlay: {
    position: "fixed", top:0, left:0, right:0, bottom:0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex", justifyContent: "center", alignItems: "center",
    zIndex: 999
  },
  modalContent: {
    backgroundColor: "#0B3D2E",
    padding: "20px",
    borderRadius: "12px",
    width: "400px",
    maxHeight: "80vh",
    overflowY: "auto",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    border: "1px solid #1E6650",
  },
  modalComments: { maxHeight: "300px", overflowY: "auto", borderTop: "1px solid #ccc", paddingTop: "10px" },
  modalInputContainer: { display: "flex", gap: "10px", marginTop: "10px" },
  commentInput: {
    flex: 1,
    padding: "10px 16px",
    borderRadius: "25px",
    border: "1px solid #ccc",
    outline: "none",
    fontSize: "14px",
    background: "#f9f9f9",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    transition: "all 0.3s ease",
  },
  commentButtonModal: {
    padding: "10px 18px",
    borderRadius: "25px",
    border: "none",
    background: "linear-gradient(135deg, #3B82F6, #2563EB)",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  modalCloseButton: { position: "absolute", top: "10px", right: "10px", border: "none", background: "transparent", fontSize: "18px", cursor: "pointer" },
};
export default Home;




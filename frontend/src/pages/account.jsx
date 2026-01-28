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
        // ajouter un champ "editing" à chaque post pour gérer l'édition
        const postsWithEditing = data.map(p => ({ ...p, editing: false }));
        setPosts(postsWithEditing);

        if (data.length > 0 && data[0].author) {
          setUsername(data[0].author.username);
        }
      } else {
        console.error("API a renvoyé autre chose qu'un tableau", data);
      }
    } catch (error) {
      console.error("Erreur fetch posts :", error);
    }
  };

  // 🔹 Passer un post en mode édition
  const handleEdit = (id) => {
    setPosts(posts.map(p => p._id === id ? { ...p, editing: true } : p));
  };

  // 🔹 Annuler l'édition
  const handleCancel = (id) => {
    setPosts(posts.map(p => p._id === id ? { ...p, editing: false } : p));
  };

  // 🔹 Modifier le titre ou le contenu en temps réel
  const handleEditChange = (id, field, value) => {
    setPosts(posts.map(post => 
      post._id === id 
        ? { ...post, [field]: value } 
        : post
    ));
  };

  // 🔹 Sauvegarder les modifications vers le backend
  const handleSave = async (postId, title, content) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch(`http://localhost:5000/api/posts/${postId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content }),
    });

    const result = await res.json();

    if (res.status === 200) {
      alert("Post modifié avec succès !");
      setPosts(posts.map(p => p._id === postId ? { ...p, title, content, editing: false } : p));
    } else {
      alert(result.error || "Erreur lors de la modification");
    }
  } catch (err) {
    alert("Erreur serveur : " + err.message);
  }
};

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div>
      {/* Header du compte */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
        <FaUserCircle size={50} />
        <h2>{username}</h2>
      </div>

      {/* Liste des posts */}
      <div>
        {Array.isArray(posts) && posts.length > 0 ? (
          posts.map((post) => (
            <div key={post._id} style={{ border: "1px solid gray", padding: "10px", marginBottom: "10px" }}>
              {post.editing ? (
                <>
                  <input
                    type="text"
                    value={post.title}
                    onChange={(e) => handleEditChange(post._id, "title", e.target.value)}
                    style={{ width: "100%", marginBottom: "5px" }}
                  />
                  <textarea
                    value={post.content}
                    onChange={(e) => handleEditChange(post._id, "content", e.target.value)}
                    style={{ width: "100%", marginBottom: "5px" }}
                  />
                  <button onClick={() => handleSave(post._id, post.title, post.content)}>Sauvegarder</button>
                  <button onClick={() => handleCancel(post._id)} style={{ marginLeft: "5px" }}>Annuler</button>
                </>
              ) : (
                <>
                  <h3>{post.title}</h3>
                  <p>{post.content}</p>
                  <button onClick={() => handleEdit(post._id)}>Modifier</button>
                </>
              )}
            </div>
          ))
        ) : (
          <p>Aucun post pour le moment.</p>
        )}
      </div>
    </div>
  );
};

export default Account;

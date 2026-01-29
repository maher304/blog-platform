const express = require("express");
require("dotenv").config();
console.log("ENV FILE LOADED");
console.log("MONGO_URI =", process.env.MONGO_URI);
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const cors = require("cors");
const jwt = require("jsonwebtoken"); 
const authMiddleware = require("./middleware/authMiddleware");


const User = require("./models/users");
const Post = require("./models/posts");

const app = express();


// Middleware
app.use(express.json());
app.use(cors());

const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;
const PORT = process.env.PORT || 5000;

// Connexion à MongoDB
mongoose.connect(MONGO_URI)
    .then(() => console.log("MongoDB connected ✅"))
    .catch(err => console.error("MongoDB connection error:", err));

// Routes

// Register
app.post("/api/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ username, email, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: "User created successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "User registration failed" });
    }
});

 //Login
app.post("/api/login",async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    //const isMatch = await bcrypt.compare(password, user.password);
//testing
  console.log("User password hash:", user.password); // mot de passe hashé dans la DB
    console.log("Password entered:", password);        // mot de passe que tu tapes
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("isMatch:", isMatch); 

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token,
    });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});
//home
app.get("/api/home",authMiddleware, (req, res) =>{
     res.json({ message: "Welcome to the home page!", user: req.user });
});


     


// Create Post
app.post("/api/posts", async (req, res) => {
    try {
        const { title, content, authorId } = req.body;
        const post = new Post({ title, content, author: authorId });
        await post.save();
        res.status(201).json({ message: "Post created successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create post" });
    }
});

// Get all posts
app.get("/api/posts",authMiddleware, async (req, res) => {
    try {
        const posts = await Post.find().populate("author", "username email");
        res.json(posts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch posts" });
    }
});

//get poste de ce profile 
app.get("/api/postsaccount",authMiddleware,async (req,res)=>{
  try{
    const authorId = req.user.id; 
    const postaccount = await Post.find({author: authorId} ).populate("author","username email");
    res.json(postaccount);
  } catch(err){
    console.error(err);
    res.status(500).json({error:"failed to fetch posts de ce accout"});
  }
}
);
//modihfier les poste
app.put("/api/posts/:id", authMiddleware, async (req, res) => {
  try {
    const postId = req.params.id;
    const { title, content } = req.body;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post non trouvé" });
    if (post.author.toString() !== userId)
      return res.status(403).json({ error: "Pas autorisé" });

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { title, content },
      { new: true }
    );

    res.status(200).json(updatedPost); // ✅ doit renvoyer JSON
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

//suprimer le poste 

app.delete("/api/posts/:id", authMiddleware, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    // 1️⃣ Trouver le post
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post introuvable" });
    }

    // 2️⃣ Vérifier le propriétaire
    if (post.author.toString() !== userId) {
      return res.status(403).json({ message: "Accès refusé" });
    }

    // 3️⃣ Supprimer le post
    await post.deleteOne();

    // 4️⃣ Réponse
    res.status(200).json({ message: "Post supprimé avec succès" });

  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});



// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

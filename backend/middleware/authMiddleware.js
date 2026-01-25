const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  // Récupère le token depuis les headers
  const token = req.headers.authorization?.split(" ")[1]; // format: "Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token missing" });
  }

  try {
    // Vérifie le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // stocke les infos de l'utilisateur dans req.user
    next(); // passe à la suite (la route)
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
}

module.exports = authMiddleware;
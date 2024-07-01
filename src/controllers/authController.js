import fs from "fs/promises";
import path from "path";
import bcrypt from "bcrypt";
import { fileURLToPath } from "url";

// Récupèrer le path absolut
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Afficher la pagin de connexion
export const showLoginPage = (req, res) => {
  res.render("login", { error: null });
};

// Gérer la soumission du formulaire
export const handleLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Récupérer les utilisateurs depuis le fichier JSON
    const usersPath = path.join(__dirname, "..", "users.json");
    const usersData = await fs.readFile(usersPath, "utf-8");
    const users = JSON.parse(usersData);

    // Ftrouver l'email du l'utilisateur
    const user = users.find((u) => u.email === email);

    if (!user) {
      // S'il n'est pas trouvé
      return res.render("login", { error: "Invalid email or password" });
    }

    // Comparer le mot de passe fourni avec l'existant
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      // Mot de passe incorrect
      return res.render("login", { error: "Invalid email or password" });
    }

    // Login réussi
    req.session.user = { email: user.email };
    res.redirect("/dashboard"); // Redirection vers la page d'accueil
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

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
    const usersPath = path.join(__dirname, "data", "users.json");
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
    res.redirect("/home"); // Redirection vers la page d'accueil
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

export const showHomePage = async (req, res) => {
  try {
    // Lire le fichier JSON
    const usersPath = path.join(__dirname, "data", "users.json");
    const usersData = await fs.readFile(usersPath, "utf-8");
    const users = JSON.parse(usersData);

    // Récupèrer un utilisateur au hasard
    const randomIndex = Math.floor(Math.random() * users.length);
    const randomUser = users[randomIndex];

    // Afficher la page d'accueil
    res.render("home", { user: randomUser });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

export const fetchAnotherUser = async (req, res) => {
  try {
    const usersPath = path.join(__dirname, "data", "users.json");
    const usersData = await fs.readFile(usersPath, "utf-8");
    const users = JSON.parse(usersData);

    // Récupèrer un autre utilisateur au hasard
    const randomIndex = Math.floor(Math.random() * users.length);
    const randomUser = users[randomIndex];

    // Envoyer la réponse JSON
    res.json(randomUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch another user" });
  }
};

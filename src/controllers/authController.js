import fs from "fs/promises";
import path from "path";
import bcrypt from "bcrypt";
import { fileURLToPath } from "url";

// Récupèrer le chemin absolu du fichier JSON
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const usersFilePath = path.resolve(__dirname, "../../data/users.json");

// Fonction pour lire les utilisateurs depuis le fichier JSON
const readUsersFromFile = async () => {
  const usersData = await fs.readFile(usersFilePath, "utf-8");
  return JSON.parse(usersData);
};

// Afficher la page de connexion
export const showLoginPage = (req, res) => {
  res.render("login", { error: null });
};

// Gérer la soumission du formulaire de connexion
export const handleLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const users = await readUsersFromFile();

    // Trouver l'utilisateur avec l'email fourni
    const user = users.find((u) => u.email === email);

    if (!user) {
      // Si l'utilisateur n'est pas trouvé, afficher un message d'erreur
      return res.render("login", { error: "Invalid email or password" });
    }

    // Comparer le mot de passe fourni avec celui stocké dans les données de l'utilisateur
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      // Si les mots de passe ne correspondent pas, afficher un message d'erreur
      return res.render("login", { error: "Invalid email or password" });
    }

    // Authentification réussie, définir l'utilisateur dans la session
    req.session.userId = user.id;
    req.session.isAdmin = user.isAdmin; 
    res.redirect("/home"); // Redirection vers la page d'accueil
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// Gérer la déconnexion
export const handleLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      // Si le destroy échoue, on gérer l'erreur et on redirige vers la page d'accueil
      console.error("Error destroying session:", err);
      return res.redirect("/home");
    }
    // Si le destroy réussi, on redirige vers la page d'accueil
    res.redirect("/login");
  });
};

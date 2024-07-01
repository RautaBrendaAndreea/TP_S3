import express from "express";
import {
  showLoginPage,
  handleLogin,
  handleLogout,
} from "./src/controllers/authController.js";
import { showUser } from "./src/controllers/userController.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.redirect("/login");
});

// Route de gestion de l'affichage de la page de connexion
router.get("/login", showLoginPage);

// Route pour gérer la soumission du formulaire de connexion
router.post("/login", handleLogin);

// Route pour gérer la déconnexion
router.post("/login", handleLogout);

// Route pour gérer l'affichage de la page d'accueil
router.get("/home", showUser);

export default router;

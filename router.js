import express from "express";
import {
  showLoginPage,
  handleLogin,
  showHomePage,
  fetchAnotherUser,
} from "./src/controllers/authController.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.redirect("/login");
});

// Route de gestion de l'affichage de la page de connexion
router.get("/login", showLoginPage);

// Route pour gérer la soumission du formulaire de connexion
router.post("/login", handleLogin);

// Route pour gérer l'affichage de la page d'accueil
router.get("/home", showHomePage);

// Route pour récupèrer les données d'un utilisateur au hasard
router.get("/home", fetchAnotherUser);

export default router;

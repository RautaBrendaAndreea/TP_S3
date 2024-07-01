import express from "express";
import {
  showLoginPage,
  handleLogin,
} from "./src/controllers/authController.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.redirect("/login");
});

// Routes de gestion de l'affichage des pages
router.get("/login", showLoginPage);

// Routes pour gérer la soumission des formulaires
router.post("/login", handleLogin);

export default router;

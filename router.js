import express from "express";
import { authMiddleware } from "./src/middleware/authMiddleware.js";
import { adminMiddleware } from "./src/middleware/adminMiddleware.js";
import {
  showLoginPage,
  handleLogin,
  handleLogout,
} from "./src/controllers/authController.js";
import { 
  showUser, 
  showAllUsers,  
  updateUser, 
  showEditForm 
} from "./src/controllers/userController.js";
import {
  deleteUser, showAddUserForm, addNewUser, updateAdminUser, showAdminEditForm
} from './src/controllers/adminController.js'

const router = express.Router();

router.use(authMiddleware);

router.get("/", (req, res) => {
  res.redirect("/login");
});

// Route de gestion de l'affichage de la page de connexion
router.get("/login", showLoginPage);

// Route pour gérer la soumission du formulaire de connexion
router.post("/login", handleLogin);

// Route pour gérer la déconnexion
router.post("/logout", handleLogout);

// Route pour gérer l'affichage de la page d'accueil
router.get("/home", showUser);

// Route pour la liste des utilisateurs
router.get('/listing', showAllUsers);

// Route GET pour mettre à jour les informations du profil
router.get('/edit', showEditForm);

// Route POST pour mettre à jour les informations du profil
router.post('/edit', updateUser);

// Route pour la suppression d'un utilisateur
router.delete("/delete/:id", deleteUser);

// Routes d'administration
router.get('/admin/add',adminMiddleware, showAddUserForm);
router.post('/admin/add',adminMiddleware, addNewUser); 

router.get('/admin/edit/:id', adminMiddleware, showAdminEditForm);
router.post('/admin/edit/:id', adminMiddleware, updateAdminUser);


router.use((req, res, next) => {
  res.status(404).send('Page not found');
});

export default router;

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
  deleteUser, 
  showAddUserForm, 
  addNewUser, 
  updateAdminUser, 
  showAdminEditForm
} from './src/controllers/adminController.js'

const router = express.Router();

router.use(authMiddleware);


// Login/Logout
router.get("/", (req, res) => res.redirect("/login"));
router.get("/login", showLoginPage);
router.post("/login", handleLogin);
router.get("/logout", handleLogout);


// Route pour gérer l'affichage de la page d'accueil et des users
router.get("/home", showUser);
router.get('/listing', showAllUsers);


// Route GET et POST pour mettre à jour les informations du profil
router.get('/edit', showEditForm);
router.post('/edit/:userId', updateUser);


// Route pour la suppression d'un utilisateur
router.delete("/delete/:userId", deleteUser);

// Routes d'administration
router.get('/admin/add',adminMiddleware, showAddUserForm);
router.post('/admin/add',adminMiddleware, addNewUser); 
router.get('/admin/edit/:userId', adminMiddleware, showAdminEditForm);
router.post('/admin/edit/:userId', adminMiddleware, updateAdminUser);


router.use((req, res, next) => {
  res.status(404).send('Page not found');
});

export default router;

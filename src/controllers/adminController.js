import userService from "../services/userService.js";
import User from "../models/User.js";
import { validateData } from "../helpers/validation.js";
import bcrypt from "bcrypt";

const saltRounds = 10;

// Afficher le formulaire d'ajout d'utilisateur
export const showAddUserForm = async (req, res) => {
  try {
    res.render("add");
  } catch (error) {
    console.error(
      "Erreur lors de l'affichage du formulaire d'ajout d'utilisateur : ",
      error
    );
    res.status(500).send("Erreur serveur");
  }
};

// Ajouter un nouvel utilisateur
export const addNewUser = async (req, res) => {
  try {
    const {
      gender,
      category,
      lastname,
      firstname,
      email,
      password,
      phone,
      birthdate,
      city,
      country,
      photo,
      isAdmin,
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = {
      gender,
      category,
      lastname,
      firstname,
      email,
      password: hashedPassword,
      phone,
      birthdate,
      city,
      country,
      photo,
      isAdmin: isAdmin === "on",
    };

    await userService.createUser(newUser);
    res.redirect("/listing");
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'utilisateur : ", error);
    res.status(500).send("Erreur serveur");
  }
};

// Supprimer un utilisateur
export const deleteUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression de l'utilisateur" });
  }
};

// Afficher le formulaire d'édition pour l'administrateur
export const showAdminEditForm = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await userService.getUserById(userId);

    if (!user) {
      return res.status(404).send("Utilisateur non trouvé");
    }

    res.render("edit", { user, isAdmin: req.session.isAdmin, errors: {} });
  } catch (error) {
    console.error(
      "Erreur lors de l'affichage du formulaire d'édition : ",
      error
    );
    res.status(500).send("Erreur serveur");
  }
};

// Mettre à jour un utilisateur par un administrateur
export const updateAdminUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const {
      gender,
      category,
      lastname,
      firstname,
      email,
      password,
      phone,
      birthdate,
      city,
      country,
      photo,
      isAdmin,
    } = req.body;

    // Validation des données du formulaire
    const errors = validateData({
      gender,
      category,
      lastname,
      firstname,
      email,
      password,
      phone,
      birthdate,
      city,
      country,
      photo,
    });

    if (Object.keys(errors).length > 0) {
      // Si des erreurs sont présentes, retourner le formulaire avec les erreurs
      return res.render("edit", {
        user: { ...req.body },
        errors,
      });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const updateData = {
      gender,
      category,
      lastname,
      firstname,
      email,
      password: hashedPassword,
      phone,
      birthdate,
      city,
      country,
      photo,
      isAdmin: isAdmin === "on",
    };

    const user = await userService.getUserById(userId);
    if (!user) {
      return res.status(404).send("Utilisateur non trouvé");
    }

    await userService.updateUser(userId, updateData);
    res.redirect("/listing");
  } catch (err) {
    console.error("Erreur lors de la modification :", err);
    res.status(500).send("Erreur serveur");
  }
};

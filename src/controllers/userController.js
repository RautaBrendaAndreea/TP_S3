import dayjs from "dayjs";
import bcrypt from "bcrypt";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { getAllUsers, writeAllUsers } from "../services/userService.js";

import "dayjs/locale/fr.js";

// Récupérer le chemin absolu du fichier JSON
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const saltRounds = 10;

// Fonction pour calculer l'âge à partir de la date de naissance
const calculateAge = (birthdate) => {
  const now = dayjs();
  const birthDate = dayjs(birthdate);
  return now.diff(birthDate, "year");
};

// Fonction pour récupérer un utilisateur au hasard
export const getRandomUser = async () => {
  try {
    const users = await getAllUsers();
    const randomIndex = Math.floor(Math.random() * users.length);
    return users[randomIndex];
  } catch (error) {
    console.error(
      "Erreur lors de la récupération d'un utilisateur au hasard : ",
      error
    );
    throw error;
  }
};

// Afficher la page d'accueil avec un utilisateur au hasard
export const showUser = async (req, res) => {
  try {
    const randomUser = await getRandomUser();

    const formatedBirthdate = dayjs(randomUser.birthdate)
      .locale("fr")
      .format("D MMMM");

    const age = calculateAge(randomUser.birthdate);

    res.render("home", { user: { ...randomUser, formatedBirthdate, age } });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur serveur");
  }
};

// Afficher tous les utilisateurs
export const showAllUsers = async (req, res) => {
  try {
    if (!req.session.userId) {
      // Vérification de l'authentification
      res.status(401).send("Utilisateur non authentifié");
      return;
    }

    const users = await getAllUsers();
    const filteredUsers = users.filter(
      (user) => user.id.toString() !== req.session.userId.toString()
    );

    // Formater les dates de naissance de chaque utilisateur
    const usersWithFormattedDate = filteredUsers.map((user) => ({
      ...user,
      formatedBirthdate: dayjs(user.birthdate).locale("fr").format("D MMMM"), // Formatage de la date de naissance
      age: calculateAge(user.birthdate), // affichage de l'âge de l'utilisateur
    }));

    res.render("listing", {
      users: usersWithFormattedDate,
      isAdmin: req.session.isAdmin, // Passer le statut admin à la vue
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur serveur");
  }
};

// Afficher le formulaire de modification du profil
export const showEditForm = async (req, res) => {
  try {
    // Récupérer les informations de l'utilisateur à partir de req.session.userId
    const users = await getAllUsers();
    const user = users.find(
      (user) => user.id.toString() === req.session.userId.toString()
    );

    if (!user) {
      return res.status(404).send("Utilisateur non trouvé");
    }
    // Passer les données de l'utilisateur à la vue
    res.render("edit", { user });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur serveur");
  }
};

// Mettre à jour les informations du profil
export const updateUser = async (req, res) => {
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
    } = req.body;

    // Valider les données
    if (!validateData(req.body)) {
      return res.status(400).send("Données invalides");
    }

    let users = await getAllUsers();

    // Trouver l'utilisateur à mettre à jour
    const userIndex = users.findIndex(
      (user) => user.id.toString() === req.session.userId.toString()
    );

    if (userIndex === -1) {
      return res.status(404).send("Utilisateur non trouvé");
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Mettre à jour les informations de l'utilisateur
    users[userIndex] = {
      ...users[userIndex],
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
    };

    await writeAllUsers(users);

    res.redirect("/home");
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur serveur");
  }
};

// Fonction pour valider les données
const validateData = ({
  gender,
  category,
  lastname,
  firstname,
  email,
  password,
}) => {
  if (!gender || !category || !lastname || !firstname || !email || !password) {
    return false;
  }
  return true;
};

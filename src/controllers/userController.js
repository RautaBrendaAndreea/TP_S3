import dayjs from "dayjs";
import bcrypt from 'bcrypt';
import userService from '../services/userService.js';  
import "dayjs/locale/fr.js";
import userService from "../services/userService.js";
import { validateData } from "../helpers/validation.js";

const saltRounds = 10;

// Fonction pour calculer l'âge à partir de la date de naissance
const calculateAge = (birthdate) => {
    const now = dayjs();
    const birthDate = dayjs(birthdate);
    return now.diff(birthDate, "year");
  };


// Fonction pour calculer l'âge à partir de la date de naissance
const calculateAge = (birthdate) => {
  const now = dayjs();
  const birthDate = dayjs(birthdate);
  return now.diff(birthDate, "year");
};

export const getRandomUser = async () => {
  try {
    const users = await userService.getAllUsers();
    return users[Math.floor(Math.random() * users.length)];
  } catch (error) {
    console.error(
      "Erreur lors de la récupération d'un utilisateur au hasard : ",
      error
    );
    throw error;
  }
};

export const showUser = async (req, res) => {
  try {
    const randomUser = await getRandomUser();
    const formatedBirthdate = dayjs(randomUser.birthdate)
      .locale("fr")
      .format("D MMMM");

        const age = calculateAge(randomUser.birthdate);


    console.log(formatedBirthdate);

    const age = calculateAge(randomUser.birthdate);

    res.render("home", {
      user: { ...randomUser.toObject(), formatedBirthdate, age },
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur serveur");
  }
};

export const showAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    const filteredUsers = users.filter(
      (user) => user.id.toString() !== req.session.userId.toString()
    );
    const usersWithFormattedDate = filteredUsers.map((user) => ({
      ...user.toObject(),
      formattedBirthdate: formatDate(user.birthdate),
    }));

    res.render("listing", {
      users: usersWithFormattedDate,
      isAdmin: req.session.isAdmin,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur serveur");
  }
};

export const showEditForm = async (req, res) => {
  try {
    const user = await userService.getUserById(req.session.userId);
    if (!user) {
      return res.status(404).send("Utilisateur non trouvé");
    }
    res.render("edit", { user: user.toObject() });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur serveur");
  }
};

export const updateUser = async (req, res) => {
  try {
    if (!validateData(req.body)) {
      return res.status(400).send("Données invalides");
    }

    const updateData = { ...req.body };
    await userService.updateUser(req.session.userId, updateData);
    res.redirect("/home");
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur serveur");
  }
};

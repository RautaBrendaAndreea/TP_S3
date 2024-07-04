import dayjs from "dayjs";
import bcrypt from "bcrypt";
import userService from "../services/userService.js";
import "dayjs/locale/fr.js";
import { validateData } from "../helpers/validation.js";

const saltRounds = 10;

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
    console.log(age)

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
    if (!req.session.userId) {
      // Vérification de l'authentification
      res.status(401).send("Utilisateur non authentifié");
      return;
    }

    const users = await userService.getAllUsers();
    const filteredUsers = users.filter(
      (user) => user.id.toString() !== req.session.userId.toString()
    );

    // Formater les dates de naissance de chaque utilisateur
    const usersWithFormattedDate = filteredUsers.map((user) => ({
      ...user.toObject(),
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

export const showEditForm = async (req, res) => {
  try {
    const user = await userService.getUserById(req.session.userId);
    if (!user) {
      return res.status(404).send("Utilisateur non trouvé");
    }
    res.render("edit", { user: user.toObject(), errors: {} });
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

    // Hash du mot de passe si modifié
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
    };

    await userService.updateUser(req.session.userId, updateData);
    res.redirect("/home");
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur serveur");
  }
};

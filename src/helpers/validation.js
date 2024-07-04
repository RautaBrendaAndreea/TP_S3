import userService from "../services/userService.js";

// Fonction pour valider les données
export const validateData = ({
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
}) => {
  let errors = {};

  // Vérifier que tous les champs requis sont remplis
  if (
    !gender ||
    !category ||
    !lastname ||
    !firstname ||
    !email ||
    !password ||
    !phone ||
    !birthdate ||
    !city ||
    !country ||
    !photo
  ) {
    errors.global = "Tous les champs doivent être remplis.";
  }

  // Validation du format de l'email
  if (email && !isValidEmail(email)) {
    errors.email = "L'email n'est pas au bon format.";
  }

  // Regex pour le mdp, doit contenir au moins 8 caractères, une majuscule et une minuscule
  if (password && !isValidPassword(password)) {
    errors.password =
      "Le mot de passe doit contenir au moins 8 caractères, une majuscule et une minuscule.";
  }

  return errors;
};

// Fonction pour valider le format de l'email
const isValidEmail = (email) => {
  // Utilisation d'une regex  pour valider l'email
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

// Fonction pour valider le mot de passe
const isValidPassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  return passwordRegex.test(password);
};

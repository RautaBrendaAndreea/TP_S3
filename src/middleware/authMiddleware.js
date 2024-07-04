import userService from "../services/userService.js";

export const authMiddleware = async (req, res, next) => {
  // Si l'utilisateur n'est pas authentifié, on le redirige vers login
  if (!req.session.userId) {
    return res.redirect("/login");
  }

  try {
    // Cherche l'utilisateur connecté
    const loggedInUser = await userService.getUserById(req.session.userId);

    if (loggedInUser) {
      // On enregistre les détails de l'utilisateur dans res.locals
      res.locals.loggedInUser = loggedInUser;
      res.locals.isAdmin = loggedInUser.isAdmin;
      // Passe au middleware suivant ou au routeur
      return next();
    } else {
      // Si l'utilisateur n'est pas trouvé, on le redirige vers login
      return res.redirect("/login");
    }
  } catch (err) {
    console.error(
      "Erreur lors de la récupération de l'utilisateur connecté :",
      err
    );
    // En cas d'erreur, redirige vers login
    return res.redirect("/login");
  }
};

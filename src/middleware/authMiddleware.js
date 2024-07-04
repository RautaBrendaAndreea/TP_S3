import userService from '../services/userService.js'; 

export const authMiddleware = async (req, res, next) => {
  if (req.session.userId) {
    try {
      const loggedInUser = await userService.getUserById(req.session.userId);

      if (loggedInUser) {
        res.locals.loggedInUser = loggedInUser;
        res.locals.isAdmin = loggedInUser.isAdmin;
      }
    } catch (err) {
      console.error(
        "Erreur lors de la récupération de l'utilisateur connecté :",
        err
      );
    }
  }
  next();
};
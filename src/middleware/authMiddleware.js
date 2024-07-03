import userService from '../services/userService.js'; 

export const authMiddleware = async (req, res, next) => {
  if (!req.session.userId) {
    return next();
  }
  try {
    const loggedInUser = await userService.getUserById(req.session.userId);

    if (!loggedInUser) {n
      console.error("Session utilisateur référence un utilisateur inexistant");
      req.session.destroy();
      res.clearCookie('connect.sid'); 
      return res.redirect('/login');
    }
    res.locals.loggedInUser = loggedInUser;
    res.locals.isAdmin = loggedInUser.isAdmin;
    next();
  } catch (err) {
    console.error("Erreur lors de la récupération de l'utilisateur connecté :", err);
    res.status(500).send("Erreur serveur interne");
  }
  next();
};

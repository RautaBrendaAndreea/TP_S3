import session from "express-session";

export const authenticateUser = (req, res, next) => {
  if (req.session.user) {
    // Vérifier si l'utilisateur est connecté
    next();
  } else {
    // L'utilisateur n'est pas connecté, renvoyer l'erreur
    res.status(401).send("Unauthorized");
  }
};

export const sessionMiddleware = session({
  name: "simple",
  secret: "simple",
  resave: false,
  saveUninitialized: true,
});

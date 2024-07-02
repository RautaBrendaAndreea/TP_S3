import { getAllUsers } from '../services/userService.js';

export const authMiddleware = async (req, res, next) => {
    if (req.session.userId) {
        try {
            const users = await getAllUsers();
            const loggedInUser = users.find(user => user.id.toString() === req.session.userId.toString());
            if (loggedInUser) {
                res.locals.loggedInUser = loggedInUser;
                res.locals.isAdmin = loggedInUser.isAdmin;

            }
        } catch (err) {
            console.error("Erreur lors de la récupération de l'utilisateur connecté :", err);
        }
    }
    next();
};

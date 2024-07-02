export const adminMiddleware = (req, res, next) => {
    if (req.session.isAdmin) {
        next(); 
    } else {
        res.status(403).send('Accès refusé');
    }
};

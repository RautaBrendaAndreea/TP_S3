import dayjs from "dayjs";
import bcrypt from 'bcrypt';
import userService from '../services/userService.js';  // Assurez-vous que le chemin vers userService est correct
import "dayjs/locale/fr.js";

const saltRounds = 10;

// Récupérer un utilisateur au hasard
export const getRandomUser = async () => {
    try {
        const users = await userService.getAllUsers();
        const randomIndex = Math.floor(Math.random() * users.length);
        return users[randomIndex];
    } catch (error) {
        console.error('Erreur lors de la récupération d\'un utilisateur au hasard : ', error);
        throw error; 
    }
};

// Afficher la page d'accueil avec un utilisateur au hasard
export const showUser = async (req, res) => {
    try {
        const randomUser = await getRandomUser();
        const formatedBirthdate = dayjs(randomUser.birthdate)
          .locale("fr")
          .format("D MMMM YYYY");
        res.render("home", { user: { ...randomUser.toObject(), formatedBirthdate } });
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur serveur");
    }
};

// Afficher tous les utilisateurs
export const showAllUsers = async (req, res) => {
    try {
        if (!req.session.userId) {  // Vérification de l'authentification
            res.status(401).send('Utilisateur non authentifié');
            return;
        }
  
        const users = await userService.getAllUsers();
        const filteredUsers = users.filter(user => user.id.toString() !== req.session.userId.toString());
  
        const usersWithFormattedDate = filteredUsers.map(user => ({
            ...user.toObject(),
            formatedBirthdate: dayjs(user.birthdate).locale("fr").format("D MMMM YYYY")
        }));
  
        res.render('listing', { 
            users: usersWithFormattedDate,
            isAdmin: req.session.isAdmin // Passer le statut admin à la vue
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur serveur');
    }
};

// Afficher le formulaire de modification du profil
export const showEditForm = async (req, res) => {
    try {
        const user = await userService.getUserById(req.session.userId);
        if (!user) {
            return res.status(404).send('Utilisateur non trouvé');
        }
        res.render('edit', { user: user.toObject() });
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur serveur');
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
            photo
        } = req.body;

        if (!validateData(req.body)) {
            return res.status(400).send('Données invalides');
        }

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
            photo
        };

        const updatedUser = await userService.updateUser(req.session.userId, updateData);
        res.redirect('/home');
    
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur serveur');
    }
};

const validateData = ({ gender, category, lastname, firstname, email, password }) => {
    return !!(gender && category && lastname && firstname && email && password);
};

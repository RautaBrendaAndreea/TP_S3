import dayjs from "dayjs";
import bcrypt from 'bcrypt';
import fs from "fs/promises";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { getAllUsers, writeAllUsers, generateNextUserId  } from '../services/userService.js';


const saltRounds = 10;


// Afficher le formulaire d'ajout d'utilisateur
export const showAddUserForm = async (req, res) => {
    try {
        res.render('add'); 
    } catch (error) {
        console.error("Erreur lors de l'affichage du formulaire d\'ajout d\'utilisateur : ", error);
        res.status(500).send('Erreur serveur');
    }
};


// Contrôleur pour traiter l'ajout d'utilisateur (accessible uniquement par les admins)
export const addNewUser = async (req, res) => {
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
            isAdmin 
        } = req.body;

        const isAdminUser = isAdmin === 'on';

        // Hacher le mot de passe
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUserId = await generateNextUserId();

        const newUser = {
            id: newUserId,
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
            isAdmin: isAdminUser 
        };

        let users = await getAllUsers();

        users.push(newUser);

        await writeAllUsers(users);

        res.redirect('/listing'); 
    } catch (error) {
        console.error("Erreur lors de l'ajout de l'utilisateur : ", error);
        res.status(500).send('Erreur serveur');
    }
};

// Fonction pour supprimer un utilisateur par ID
export const deleteUser = async (req, res) => {
    try {
      const userId = req.params.id;
  
      let users = await getAllUsers();
      users = users.filter(user => user.id.toString() !== userId.toString());
  
      await writeAllUsers(users);
  
      res.status(200).send('Utilisateur supprimé avec succès');
    } catch (err) {
      console.error(err);
      res.status(500).send("Erreur lors de la suppression de l'utilisateur");
    }
};

// Contrôleur pour afficher le formulaire d'édition par un administrateur
export const showAdminEditForm = async (req, res) => {
    try {
        const userId = req.params.id;
        const users = await getAllUsers();
        const user = users.find(user => user.id.toString() === userId.toString());

        console.log("Editing user: ", user); 

        if (!user) {
            return res.status(404).send('Utilisateur non trouvé');
        }

        res.render('edit', { user, isAdmin: req.session.isAdmin });
    } catch (error) {
        console.error("Erreur lors de l'affichage du formulaire d'édition d'utilisateur par l'administrateur : ", error);
        res.status(500).send('Erreur serveur');
    }
};

// Mettre à jour les informations d'un utilisateur par un administrateur
export const updateAdminUser = async (req, res) => {
    try {
        const userId = req.params.id;
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
            isAdmin 
        } = req.body;

        const isAdminUser = isAdmin === 'on';
        let users = await getAllUsers();
        const userIndex = users.findIndex(user => user.id.toString() === userId);

        if (userIndex === -1) {
            return res.status(404).send('Utilisateur non trouvé');
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        users[userIndex] = {
            id: userId, 
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
            isAdmin: isAdminUser
        };

        await writeAllUsers(users);

        res.redirect('/listing');
    } catch (err) {
        console.error("Erreur lors de la modification:", err);
        res.status(500).send('Erreur serveur');
    }
};

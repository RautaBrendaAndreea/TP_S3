import dayjs from "dayjs";
import bcrypt from 'bcrypt';
import userService from '../services/userService.js'; 
import mongoose from "mongoose";
import User from "../models/User.js";

const saltRounds = 10;

// Afficher le formulaire d'ajout d'utilisateur
export const showAddUserForm = async (req, res) => {
    try {
        res.render('add'); 
    } catch (error) {
        console.error("Erreur lors de l'affichage du formulaire d'ajout d'utilisateur : ", error);
        res.status(500).send('Erreur serveur');
    }
};

// Ajouter un nouvel utilisateur
export const addNewUser = async (req, res) => {
    try {
        const newUser = {...req.body, isAdmin: req.body.isAdmin === 'on'};
        await userService.createUser(newUser);
        res.redirect('/listing'); 
    } catch (error) {
        console.error("Erreur lors de l'ajout de l'utilisateur : ", error);
        res.status(500).send('Erreur serveur');
    }
};

// Supprimer un utilisateur
export const deleteUser = async (req, res) => {
    const userId = req.params.userId;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        await User.findByIdAndDelete(userId);

        res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression', error);
        res.status(500).json({ message: "Erreur lors de la suppression de l'utilisateur" });
    }
};



// Afficher le formulaire d'édition pour l'administrateur
export const showAdminEditForm = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await userService.getUserById(userId);

        if (!user) {
            return res.status(404).send('Utilisateur non trouvé');
        }

        res.render('edit', { user, isAdmin: req.session.isAdmin });
    } catch (error) {
        console.error("Erreur lors de l'affichage du formulaire d'édition : ", error);
        res.status(500).send('Erreur serveur');
    }
};

// Mettre à jour un utilisateur par un administrateur
export const updateAdminUser = async (req, res) => {
    try {
        const updateData = {...req.body, isAdmin: req.body.isAdmin === 'on'};
        await userService.updateUser(req.params.id, updateData);
        res.redirect('/listing');
    } catch (err) {
        console.error("Erreur lors de la modification :", err);
        res.status(500).send('Erreur serveur');
    }
};

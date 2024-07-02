import fs from 'fs/promises'; 
const usersFilePath = './data/users.json'; 

// Fonction pour lire tous les utilisateurs depuis le fichier JSON
export const getAllUsers = async () => {
  try {
    const data = await fs.readFile(usersFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Erreur lors de la lecture des utilisateurs : ', error);
    throw error; 
  }
};

// Fonction pour écrire tous les utilisateurs dans le fichier JSON
export const writeAllUsers = async (users) => {
  try {
    await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), 'utf-8');
  } catch (error) {
    console.error("Erreur lors de l'écriture des utilisateurs : ", error);
    throw error; 
  }
};

import fs from "fs/promises";
import path from "path";

import { fileURLToPath } from "url";

// Récupèrer le chemin absolu du fichier JSON
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const usersFilePath = path.resolve(__dirname, "../../data/users.json");

// Fonction pour récupèrer un utilisateur au hasard
const getRandomUser = async () => {
  const usersData = await fs.readFile(usersFilePath, "utf-8");
  const users = JSON.parse(usersData);
  const randomIndex = Math.floor(Math.random() * users.length);
  return users[randomIndex];
};

// Afficher la page d'accueil avec un utilisateur au hasard
export const showUser = async (req, res) => {
  try {
    const randomUser = await getRandomUser();
    res.render("home", { user: randomUser });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

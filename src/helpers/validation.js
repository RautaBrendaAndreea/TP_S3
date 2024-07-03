// Fonction pour valider les données
const validateData = ({ gender, category, lastname, firstname, email, password }) => {
    if (!gender || !category || !lastname || !firstname || !email || !password) {
        return false;
    }
    return true;
};
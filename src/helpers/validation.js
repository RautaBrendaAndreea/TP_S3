// Fonction pour valider les données
export const validateData = ({ gender, category, lastname, firstname, email, password }) => {
    if (!gender || !category || !lastname || !firstname || !email || !password) {
        return false;
    }
    return true;
};
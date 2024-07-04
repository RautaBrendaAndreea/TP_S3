export const validateData = ({ gender, category, lastname, firstname, email, password, phone }) => {
    if (!gender || !category || !lastname || !firstname || !email || !password || !phone) {
        return false;
    }

    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[\^$*.[\]{}()?“!@#%&/,><':;|_~`]/.test(password);

    if (!hasMinLength || !hasUpperCase || !hasNumber || !hasSpecialChar) {
        return false;
    }
    // Validation nr de téléphone
    const phonePattern = /^(\+33|0)[1-9](\d{2}){4}$/;
    if (!phonePattern.test(phone)) {
        return false;
    }

    return true;
};

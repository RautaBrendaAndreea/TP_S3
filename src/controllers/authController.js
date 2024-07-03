import bcrypt from "bcrypt";
import userService from '../services/userService.js';  

const LOGIN_ERROR_MSG = "Invalid email or password";

export const showLoginPage = (req, res) => {
  res.render("login", { error: null });
};

export const handleLogin = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);

  try {
    const user = await userService.getUserByEmail(email); 
    console.log(user);  

    if (!user) {
      return res.render("login", { error: LOGIN_ERROR_MSG });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render("login", { error: LOGIN_ERROR_MSG });
    }

    req.session.userId = user.id;
    req.session.isAdmin = user.isAdmin; 
    res.redirect("/home");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// Gérer la déconnexion
export const handleLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.redirect("/home");
    }
    res.clearCookie('connect.sid');
    res.redirect("/login");
  });
};


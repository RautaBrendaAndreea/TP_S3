import bcrypt from "bcrypt";
import userService from '../services/userService.js';  

export const showLoginPage = (req, res) => {
  res.render("login", { error: null });
};

// Gérer la soumission du formulaire de connexion
export const handleLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userService.getUserByEmail(email);  

    if (!user) {
      return res.render("login", { error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.render("login", { error: "Invalid email or password" });
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
    console.log("Session destroyed and cookie cleared");
    res.redirect("/login");
  });
};


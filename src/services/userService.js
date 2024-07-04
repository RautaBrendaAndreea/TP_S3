import User from '../models/User.js';

const userService = {
  // Créer un nouvel utilisateur
  createUser: async (userData) => {
    try {
      const user = new User(userData);
      await user.save();
      return user;
    } catch (error) {
      throw error;
    }
  },

  // Obtenir un utilisateur par son ID
  getUserById: async (userId) => {
    try {
      const user = await User.findById(userId);
      return user;
    } catch (error) {
      throw error;
    }
  },

  // Obtenir tous les utilisateurs
  getAllUsers: async () => {
    try {
      const users = await User.find({});
      return users;
    } catch (error) {
      throw error;
    }
  },

  // Mettre à jour un utilisateur
  updateUser: async (id, updateData) => {
    try {
      const user = await User.findByIdAndUpdate(id, updateData, { new: true });
      return user;
    } catch (error) {
      throw error;
    }
  },

  // Supprimer un utilisateur
  deleteUser: async (userId) => {
    try {
      const result = await User.findByIdAndDelete(userId);
      return result;
  } catch (error) {
      throw error;
  }
  },

  getUserByEmail: async (email) => {
    try {
      const user = await User.findOne({ email: email });
      return user;
    } catch (error) {
      throw error;
    }
  }
};




export default userService;
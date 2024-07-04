import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    gender: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },
    firstname: {
      type: String,
      required: true,
      maxlength: 50,
    },
    lastname: {
      type: String,
      required: true,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Le format est invalide",
      ],
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      match: [
        /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
        "Le mot de passe doit contenir au moins 8 caractères, une majuscule et une minuscule.",
      ],
    },
    phone: {
      type: String,
      required: true,
    },
    birthdate: {
      type: Date,
      required: true,
    },
    city: {
      type: String,
      required: true,
      maxlength: 100,
    },
    country: {
      type: String,
      required: true,
      maxlength: 100,
    },
    photo: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["Marketing", "Client", "Technique"],
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;

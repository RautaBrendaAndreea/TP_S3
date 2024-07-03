import dotenv from "dotenv";
import express from "express";
import path from "path";
import router from "./router.js";
import session from "express-session";
import { fileURLToPath } from "url";
import db from './src/config/db.js'

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;
const SESSION_SECRET = process.env.SESSION_SECRET;
if (!SESSION_SECRET) {
  console.error("FATAL ERROR: SESSION_SECRET is not defined.");
  process.exit(1);
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// configuration du templating avec pug
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// Middleware configuration
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

// Session configuration
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      sameSite: "strict",
    },
  })
);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke....!");
});

// Router principal
app.use("/", router);

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`);
    console.log('Connecté à MongoDB');
  });
});

db.on('error', console.error.bind(console, 'Erreur de connexion à MongoDB : '));
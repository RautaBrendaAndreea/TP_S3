import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import path from "path";
import router from "./router.js";
import session from "express-session";
import bodyParser from 'body-parser';

import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// configuration du templating avec pug
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// Middleware JSON
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));


app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  session({
    name: "simple",
    secret: "simple",
    resave: false,
    saveUninitialized: true,
  })
);

// routeur principal
app.use("/", router);

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});

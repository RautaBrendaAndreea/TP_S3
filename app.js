import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import router from './router.js';
import session from 'express-session';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware JSON
app.use(express.json());

// Middleware fichiers statiques
app.use(express.static('public'));


app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(session({
    name: "simple",
    secret: "simple",
    resave: false,
    saveUninitialized: true
}))

// routeur principal
app.use('/', router);


app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`);
});

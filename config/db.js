// /config/db.js
const mongoose = require('mongoose');
require('dotenv').config();  // Charger les variables d'environnement

const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
    try {
        const dbURI = MONGO_URI || 'mongodb+srv://etudiant:etudiant@cluster0.eutao.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
        await mongoose.connect(dbURI);
        console.log('Connexion à MongoDB réussie');
    } catch (error) {
        console.error('Erreur de connexion à MongoDB :', error);
        process.exit(1);
    }
};

module.exports = connectDB;

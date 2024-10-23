const mongoose = require('mongoose');
require('dotenv').config();  // Charger les variables d'environnement

const connectDB = async () => {
    try {
        const dbURI = process.env.MONGO_URI;
        console.log('Tentative de connexion à MongoDB avec URI:', dbURI);
        await mongoose.connect(dbURI);  // Supprimer les options obsolètes
        console.log('Connexion à MongoDB réussie');
    } catch (error) {
        console.error('Erreur de connexion à MongoDB :', error);
        process.exit(1);  // Arrêter l'application en cas d'erreur
    }
};

module.exports = connectDB;

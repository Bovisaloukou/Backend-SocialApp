const mongoose = require('mongoose');
require('dotenv').config();  // Charger les variables d'environnement

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://etudiant:etudiant@cluster0.eutao.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connexion à MongoDB réussie');
    } catch (error) {
        console.error('Erreur de connexion à MongoDB :', error);
        process.exit(1);  // Arrêter l'application en cas d'échec
    }
};

module.exports = connectDB;

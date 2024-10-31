const mongoose = require('mongoose');
const connectDB = require('./config/db');  // Importez la connexion DB
const {Confession, Reply} = require('./models/Confession');  // Assure-toi que le chemin vers ton modèle est correct

const deleteAllConfessionsAndReplies = async () => {
    try {
        await connectDB();  // Connexion à la base de données
        await Confession.deleteMany({});  // Supprime toutes les confessions
        await Reply.deleteMany({});       // Supprime toutes les réponses
        console.log("Toutes les confessions et réponses ont été supprimées.");
    } catch (error) {
        console.error("Erreur lors de la suppression des confessions et réponses :", error);
    } finally {
        mongoose.disconnect();  // Fermer la connexion après la suppression
    }
};

// Exécute la fonction de suppression
deleteAllConfessionsAndReplies();
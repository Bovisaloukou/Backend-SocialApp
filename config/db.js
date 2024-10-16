// /config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const dbURI = 'mongodb+srv://etudiant:etudiant@cluster0.eutao.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
        await mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connexion à MongoDB réussie');
    } catch (error) {
        console.error('Erreur de connexion à MongoDB :', error);
        process.exit(1);
    }
};

module.exports = connectDB;

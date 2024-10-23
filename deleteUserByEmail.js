/*const mongoose = require('mongoose');
const User = require('./models/User');  // Assure-toi que le chemin vers ton modèle User est correct
require('dotenv').config();  // Pour charger les variables d'environnement si nécessaire

// Connexion à la base de données MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connecté à MongoDB'))
.catch((error) => console.error('Erreur lors de la connexion à MongoDB', error));

const deleteUserByEmail = async (email) => {
    try {
        // Trouver et supprimer l'utilisateur basé sur son email
        const user = await User.findOneAndDelete({ email });

        if (!user) {
            console.log('Utilisateur non trouvé');
        } else {
            console.log(`Utilisateur avec l'email ${email} supprimé avec succès`);
        }
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'utilisateur', error);
    } finally {
        // Fermer la connexion à la base de données
        mongoose.connection.close();
    }
};

// Appeler la fonction avec l'email de l'utilisateur à supprimer
deleteUserByEmail('bovisaloukou@gmail.com');*/

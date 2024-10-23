const mongoose = require('mongoose');

// Schéma utilisateur
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    matricule: { type: String, required: true, unique: true },
    isVerified: { type: Boolean, default: false },  // Nouveau champ pour vérifier l'email
    verificationToken: { type: String },  // Token pour la vérification d'email
    invitedEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }]
});

// Modèle utilisateur
const User = mongoose.model('User', userSchema);

module.exports = User;
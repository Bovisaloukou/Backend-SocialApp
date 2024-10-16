// /models/User.js
const mongoose = require('mongoose');

// Schéma utilisateur
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    invitedEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }] // Événements auxquels l'utilisateur est invité
});

// Modèle utilisateur
const User = mongoose.model('User', userSchema);

module.exports = User;

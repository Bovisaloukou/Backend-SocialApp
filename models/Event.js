// /models/Event.js
const mongoose = require('mongoose');

// /models/Event.js
const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    isPrivate: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    invitedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Ajouter le champ des invités
    invitations: [{ type: String }],
    accessCode: { type: String } // Nouveau champ pour le code d'accès
});


const Event = mongoose.model('Event', eventSchema);
module.exports = Event;

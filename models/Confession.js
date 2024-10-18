const mongoose = require('mongoose');
// Schéma pour les réponses
const replySchema = new mongoose.Schema({
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reply' }]  // Référencer d'autres réponses
});
// Schéma pour les confessions
const confessionSchema = new mongoose.Schema({
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    reactions: { 
        type: Map, 
        of: Number,
        default: {}
    },
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reply' }]  // Réponses
});
// Modèles Mongoose
const Confession = mongoose.model('Confession', confessionSchema);
const Reply = mongoose.model('Reply', replySchema);

// Exporter les modèles
module.exports = { Confession, Reply };
const mongoose = require('mongoose');

// Schéma des sous-réponses
const replySchema = new mongoose.Schema({
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reply' }]  // Sous-réponses
});

// Schéma des confessions
const confessionSchema = new mongoose.Schema({
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    imageUrl: { type: String }, // URL de l'image stockée
    reactions: { 
        type: Map, 
        of: Number,
        default: {}
    },
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reply' }]  // Réponses (assurez-vous que replies est un tableau)
});

// Modèles Mongoose
const Confession = mongoose.model('Confession', confessionSchema);
const Reply = mongoose.model('Reply', replySchema);

module.exports = { Confession, Reply };
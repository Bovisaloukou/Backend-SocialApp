const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    replies: [this], // Les sous-réponses peuvent aussi être de type "replySchema"
});

const confessionSchema = new mongoose.Schema({
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    reactions: { 
        type: Map, 
        of: Number,
        default: {}
    },
    replies: [replySchema] // La confession a une liste de réponses
});

const Confession = mongoose.model('Confession', confessionSchema);

module.exports = Confession;

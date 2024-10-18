const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reply' }]  // Référencer d'autres réponses
});

const confessionSchema = new mongoose.Schema({
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    reactions: { 
        type: Map, 
        of: Number,
        default: {}
    },
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reply' }]  // Référencer d'autres réponses
});

const Reply = mongoose.model('Reply', replySchema);
const Confession = mongoose.model('Confession', confessionSchema);

module.exports = { Confession, Reply };
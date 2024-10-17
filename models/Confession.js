const mongoose = require('mongoose');

const confessionSchema = new mongoose.Schema({
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    reactions: { 
        type: Map, 
        of: Number,  // Par exemple: {"😂": 5, "😢": 2}
        default: {}
    },
    replies: [
        {
            content: String,
            createdAt: { type: Date, default: Date.now }
        }
    ]
});

const Confession = mongoose.model('Confession', confessionSchema);

module.exports = Confession;

const Confession = require('../models/Confession');

// Ajouter une réponse à une confession
exports.addReply = async (req, res) => {
    try {
        const { confessionId } = req.params;
        const { content } = req.body;

        const confession = await Confession.findById(confessionId);
        if (!confession) {
            return res.status(404).json({ error: 'Confession non trouvée' });
        }

        // Ajouter une nouvelle réponse
        confession.replies.push({ content });
        await confession.save();

        res.status(201).json(confession);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de l\'ajout de la réponse' });
    }
};

// Ajouter une sous-réponse à une réponse existante
exports.addSubReply = async (req, res) => {
    try {
        const { confessionId, replyId } = req.params;
        const { content } = req.body;

        const confession = await Confession.findById(confessionId);
        if (!confession) {
            return res.status(404).json({ error: 'Confession non trouvée' });
        }

        // Rechercher la réponse parent dans la confession
        const reply = confession.replies.id(replyId);
        if (!reply) {
            return res.status(404).json({ error: 'Réponse non trouvée' });
        }

        // Ajouter une sous-réponse à cette réponse
        reply.replies.push({ content });
        await confession.save();

        res.status(201).json(confession);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de l\'ajout de la sous-réponse' });
    }
};

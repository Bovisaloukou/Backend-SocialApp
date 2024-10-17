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

        // Récupérer la confession par ID
        const confession = await Confession.findById(confessionId);
        if (!confession) {
            return res.status(404).json({ error: 'Confession non trouvée' });
        }

        // Rechercher la réponse parent par ID
        const parentReply = confession.replies.id(replyId);
        if (!parentReply) {
            return res.status(404).json({ error: 'Réponse non trouvée' });
        }

        // Ajouter une sous-réponse à cette réponse
        parentReply.replies.push({ content, createdAt: new Date() });
        await confession.save();

        res.status(201).json(confession);
    } catch (error) {
        console.error('Erreur lors de l\'ajout de la sous-réponse:', error);
        res.status(500).json({ error: 'Erreur lors de l\'ajout de la sous-réponse' });
    }
};
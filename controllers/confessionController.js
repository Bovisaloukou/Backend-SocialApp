const { Confession, Reply } = require('../models/Confession');

// Ajouter une réponse à une confession
exports.addReply = async (req, res) => {
    try {
        const { confessionId } = req.params;
        const { content } = req.body;

        const confession = await Confession.findById(confessionId);
        if (!confession) return res.status(404).json({ error: 'Confession non trouvée' });

        // Créer une nouvelle réponse
        const newReply = new Reply({ content });
        await newReply.save();

        // Ajouter la réponse à la confession
        confession.replies.push(newReply._id);
        await confession.save();

        res.status(201).json(newReply);
    } catch (error) {
        console.error('Erreur lors de l\'ajout de la réponse :', error);
        res.status(500).json({ error: 'Erreur lors de l\'ajout de la réponse' });
    }
};

// Ajouter une sous-réponse à une réponse existante
exports.addSubReply = async (req, res) => {
    try {
        const { confessionId, replyId } = req.params;
        const { content } = req.body;

        // Trouver la confession
        const confession = await Confession.findById(confessionId);
        if (!confession) return res.status(404).json({ error: 'Confession non trouvée' });

        // Trouver la réponse parent
        const parentReply = await Reply.findById(replyId);
        if (!parentReply) return res.status(404).json({ error: 'Réponse parent non trouvée' });

        // Créer la sous-réponse
        const newReply = new Reply({ content });
        await newReply.save();

        // Ajouter la sous-réponse à la réponse parent
        parentReply.replies.push(newReply._id);
        await parentReply.save();

        res.status(201).json(newReply);
    } catch (error) {
        console.error('Erreur lors de l\'ajout de la sous-réponse :', error);
        res.status(500).json({ error: 'Erreur lors de l\'ajout de la sous-réponse' });
    }
};
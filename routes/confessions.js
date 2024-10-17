const express = require('express');
const router = express.Router();
const Confession = require('../models/Confession');
const confessionController = require('../controllers/confessionController');

// Créer une nouvelle confession
router.post('/confessions', async (req, res) => {
    try {
        const { content } = req.body;
        const newConfession = new Confession({ content });
        await newConfession.save();
        res.status(201).json(newConfession);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création de la confession' });
    }
});

// Récupérer toutes les confessions
router.get('/confessions', async (req, res) => {
    try {
        const confessions = await Confession.find().sort({ createdAt: -1 });
        res.status(200).json(confessions);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des confessions' });
    }
});

// Réagir à une confession
router.post('/confessions/:id/reactions', async (req, res) => {
    try {
        const { reaction } = req.body;  // Exemple: { reaction: '😂' }
        const confession = await Confession.findById(req.params.id);

        if (!confession) return res.status(404).json({ error: 'Confession non trouvée' });

        // Incrémenter la réaction
        confession.reactions.set(reaction, (confession.reactions.get(reaction) || 0) + 1);
        await confession.save();

        res.status(200).json(confession);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de l\'ajout de la réaction' });
    }
});

// Ajouter une réponse anonyme
router.post('/confessions/:id/replies', async (req, res) => {
    try {
        const { content } = req.body;
        const confession = await Confession.findById(req.params.id);

        if (!confession) return res.status(404).json({ error: 'Confession non trouvée' });

        confession.replies.push({ content });
        await confession.save();

        res.status(200).json(confession);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de l\'ajout de la réponse' });
    }
});

// Route pour ajouter une réponse à une confession
router.post('/confessions/:confessionId/replies', confessionController.addReply);

// Route pour ajouter une sous-réponse à une réponse spécifique d'une confession
router.post('/confessions/:confessionId/replies/:replyId', confessionController.addSubReply);

module.exports = router;

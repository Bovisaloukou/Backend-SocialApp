const express = require('express');
const Joi = require('joi');
const router = express.Router();
const { Confession } = require('../models/Confession'); // Import correct du modèle Confession
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
        const confessions = await Confession.find()
            .sort({ createdAt: -1 })  // Trier par date de création, le plus récent d'abord
            .select('content createdAt reactions')  // Limiter les champs renvoyés
            .lean();  // Utiliser lean() pour renvoyer des objets JavaScript simples

        res.status(200).json(confessions);
    } catch (error) {
        console.error('Erreur lors de la récupération des confessions:', error);  // Affiche l'erreur dans la console
        res.status(500).json({ error: 'Erreur lors de la récupération des confessions' });
    }
});

// Route pour récupérer les réponses avec pagination
router.get('/confessions/:confessionId/replies', async (req, res) => {
    try {
        const { confessionId } = req.params;
        const limit = parseInt(req.query.limit) || 10;  // Limite par défaut de 10 réponses
        const skip = parseInt(req.query.skip) || 0;     // Décalage pour la pagination

        const confession = await Confession.findById(confessionId)
            .populate({
                path: 'replies',
                options: { limit, skip, sort: { createdAt: -1 } }
            });
        
        if (!confession) {
            return res.status(404).json({ error: 'Confession non trouvée' });
        }

        res.status(200).json(confession.replies);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des réponses' });
    }
});

// Validation des réactions
const reactionSchema = Joi.object({
    reaction: Joi.string().valid('😂', '❤️', '👍', '😮').required()
});

// Réagir à une confession
router.post('/confessions/:id/reactions', async (req, res) => {
    try {
        const { error } = reactionSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const { reaction } = req.body;
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

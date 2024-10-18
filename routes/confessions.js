const express = require('express');
const router = express.Router();
const confessionController = require('../controllers/confessionController');

// Créer une nouvelle confession
router.post('/confessions', confessionController.createConfession);

// Récupérer toutes les confessions
router.get('/confessions', confessionController.getAllConfessions);

// Ajouter une réponse à une confession
router.post('/confessions/:confessionId/replies', confessionController.addReply);

// Ajouter une sous-réponse à une réponse spécifique d'une confession
router.post('/confessions/:confessionId/replies/:replyId', confessionController.addSubReply);

module.exports = router;

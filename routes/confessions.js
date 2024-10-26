const express = require('express');
const router = express.Router();
const confessionController = require('../controllers/confessionController');
const { upload } = require('../config/cloudinaryConfig');

// Route pour créer une nouvelle confession avec une image (optionnel)
router.post('/confessions', upload.single('image'), confessionController.createConfession);

// Récupérer toutes les confessions
router.get('/confessions', confessionController.getAllConfessions);

// Ajouter une réponse à une confession
router.post('/confessions/:confessionId/replies', confessionController.addReply);

// Ajouter une sous-réponse à une réponse spécifique d'une confession
router.post('/confessions/:confessionId/replies/:replyId', confessionController.addSubReply);

module.exports = router;

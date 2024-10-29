const express = require('express');
const router = express.Router();
const confessionController = require('../controllers/confessionController');
const { upload } = require('../config/cloudinaryConfig');
const auth = require('../middlewares/auth'); // Importez le middleware d'authentification

// Route pour créer une nouvelle confession avec une image (optionnel)
router.post('/confessions', upload.single('image'), confessionController.createConfession);

// Récupérer toutes les confessions
router.get('/confessions',auth, confessionController.getAllConfessions);

// Ajouter une réponse à une confession
router.post('/confessions/:confessionId/replies', confessionController.addReply);

// Ajouter une sous-réponse à une réponse spécifique d'une confession
router.post('/confessions/:confessionId/replies/:replyId', confessionController.addSubReply);

// New routes for liking confessions and replies
router.patch('/confessions/:confessionId/like',auth, confessionController.likeConfession);
router.patch('/replies/:replyId/like', confessionController.likeReply);

module.exports = router;

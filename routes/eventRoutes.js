// /routes/eventRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const eventController = require('../controllers/eventController');

// Routes événements
router.post('/events', auth, eventController.createEvent);

// Route pour obtenir tous les événements (publics et privés où l'utilisateur est invité)
router.get('/events', auth, eventController.getAllEvents);  // Ajout de la route GET /events

module.exports = router;

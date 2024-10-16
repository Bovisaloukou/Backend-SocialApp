// /routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Routes utilisateurs
router.post('/register', userController.register);
router.post('/login', userController.login);

// Route pour récupérer tous les utilisateurs
router.get('/users', userController.getAllUsers);  // Ajoutez l'authentification si nécessaire

module.exports = router;

// /middlewares/auth.js
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Accès refusé. Aucun token fourni.' });

    try {
        const bearerToken = token.split(' ')[1]; // Extraire le token après 'Bearer'
        const verified = jwt.verify(bearerToken, 'secretkey'); // Vérifie et décode le token
        console.log('Token vérifié:', verified); // Log le contenu du token
        req.user = verified; // Attache l'ID utilisateur à req.user
        console.log("Utilisateur authentifié:", req.user); // Log pour vérifier l'utilisateur authentifié
        next();
    } catch (error) {
        console.error('Erreur lors de la vérification du token:', error); // Log l'erreur du token
        res.status(400).json({ error: 'Token invalide' });
    }
};

module.exports = auth;

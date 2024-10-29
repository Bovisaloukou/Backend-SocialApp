// /server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();  // Charger les variables d'environnement

const connectDB = require('./config/db'); // Connexion à MongoDB
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const confessionRoutes = require('./routes/confessions');  // Importer les routes des confessions

const app = express();

// Configuration de CORS
const corsOptions = {
    origin: 'https://frontend-social-app-eight.vercel.app',  // Autoriser uniquement les requêtes provenant de ton frontend sur Vercel
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],  // Méthodes HTTP autorisées
    credentials: true,  // Permettre les cookies si nécessaire
  };

// Appliquer CORS avec les options configurées
app.use(cors(corsOptions));

app.use(express.json());

connectDB(); // Connexion à MongoDB

// Utiliser les routes
app.use('/users', userRoutes);
app.use('/api', eventRoutes);
app.use('/api', confessionRoutes);  // Utiliser les routes des confessions

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port: ${PORT}`);
});

// Route d'accueil
app.get('/', (req, res) => {
    res.send('Bienvenue sur notre réseau social étudiant !');
});
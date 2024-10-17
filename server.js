// /server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();  // Charger les variables d'environnement

const connectDB = require('./config/db'); // Connexion à MongoDB
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const confessionRoutes = require('./routes/confessions');  // Importer les routes des confessions

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});

connectDB(); // Connexion à MongoDB

// Utiliser les routes
app.use('/users', userRoutes);
app.use('/events', eventRoutes);
app.use('/api', confessionRoutes);  // Utiliser les routes des confessions

// Route d'accueil
app.get('/', (req, res) => {
    res.send('Bienvenue sur notre réseau social étudiant !');
});
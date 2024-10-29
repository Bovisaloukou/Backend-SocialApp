// /controllers/userController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');  // Utilitaire d'envoi d'email

// Récupérer tous les utilisateurs
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('_id name email');  // Sélectionne uniquement les champs nécessaires
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' });
    }
};

// Inscription d'un nouvel utilisateur
exports.register = async (req, res) => {
    try {
        const { name, email, password, matricule } = req.body;

        // Vérifications matricule et email
        const matriculeRegex = /^[A-Za-z0-9]+$/;
        if (!matriculeRegex.test(matricule)) {
            return res.status(400).json({ error: 'Le matricule doit contenir uniquement des lettres et des chiffres' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Cet email est déjà utilisé' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = crypto.randomBytes(32).toString('hex');  // Génère un token unique

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            matricule,
            verificationToken,  // Ajoute le token pour la vérification
        });

        await newUser.save();

        // Générer le lien de vérification avec le bon chemin `/users/verify-email`
        const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
        await sendEmail(email, 'Vérifiez votre email', `Veuillez cliquer sur ce lien pour vérifier votre email : ${verificationUrl}`);

        res.status(201).json({ message: 'Utilisateur créé avec succès. Un email de vérification a été envoyé.' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création de l\'utilisateur' });
    }
};

// Vérification de l'email via le token
exports.verifyEmail = async (req, res) => {
    try {
        const token = req.query.token; // On prend le token de la requête GET
        if (!token) {
            return res.status(400).json({ error: 'Token manquant' });
        }

        // Trouver l'utilisateur par le token de vérification
        const user = await User.findOne({ verificationToken: token });
        if (!user) {
            return res.status(400).json({ error: 'Token invalide ou utilisateur non trouvé' });
        }

        // Mettre à jour l'utilisateur comme vérifié
        user.isVerified = true;
        user.verificationToken = null;

        const updatedUser = await user.save();
        if (!updatedUser) {
            return res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'utilisateur' });
        }

        // Redirection vers la page de connexion après vérification réussie
        res.redirect(`${process.env.FRONTEND_URL}/login`);  // Redirige directement l'utilisateur vers la page de connexion

    } catch (error) {
        console.error('Erreur lors de la vérification de l\'email :', error);
        res.status(500).json({ error: 'Erreur lors de la vérification de l\'email' });
    }
};

// Connexion utilisateur
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Mot de passe incorrect' });

        // Vérifie si l'utilisateur a validé son email
        if (!user.isVerified) {
            // Bloquer les utilisateurs non vérifiés avant de créer le token
            return res.status(403).json({ error: 'Veuillez vérifier votre email avant de vous connecter.' });
        }

        // Créer un token JWT uniquement si l'email est vérifié
        const token = jwt.sign(
            { id: user._id, email: user.email },
            'secretkey',
            { expiresIn: '4h' }
        );

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la connexion' });
    }
};
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

        // Vérification du format du matricule : uniquement lettres et chiffres
        const matriculeRegex = /^[A-Za-z0-9]+$/;
        if (!matriculeRegex.test(matricule)) {
            return res.status(400).json({ error: 'Le matricule doit contenir uniquement des lettres et des chiffres' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Cet email est déjà utilisé par un autre utilisateur' });
        }

        const existingMatricule = await User.findOne({ matricule });
        if (existingMatricule) {
            return res.status(400).json({ error: 'Ce matricule est déjà utilisé par un autre utilisateur' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = crypto.randomBytes(32).toString('hex');  // Génère un token unique

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            matricule,
            verificationToken  // Stocke le token de vérification
        });

        await newUser.save();

        // Envoi de l'email de vérification
        const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
        await sendEmail(email, 'Vérifiez votre email', `Veuillez cliquer sur ce lien pour vérifier votre email : ${verificationUrl}`);

        res.status(201).json({ message: 'Utilisateur créé avec succès, un email de vérification a été envoyé.' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création de l\'utilisateur' });
    }
};

// Vérification de l'email via le token
exports.verifyEmail = async (req, res) => {
    try {
        // Récupère le token depuis le corps de la requête ou depuis l'URL
        const token = req.body.token || req.query.token;  

        if (!token) {
            return res.status(400).json({ error: 'Token manquant' });
        }

        // Trouve l'utilisateur correspondant au token de vérification
        const user = await User.findOne({ verificationToken: token });

        if (!user) {
            return res.status(400).json({ error: 'Token invalide ou utilisateur non trouvé' });
        }

        // Met à jour l'état de vérification de l'utilisateur
        user.isVerified = true;
        user.verificationToken = null;  // Supprime le token après vérification
        await user.save();

        res.status(200).json({ message: 'Email vérifié avec succès. Vous pouvez maintenant vous connecter.' });
    } catch (error) {
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
            { expiresIn: '1h' }
        );

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la connexion' });
    }
};
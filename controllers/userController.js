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
        await sendEmail(
            email,
            '🎉 Bienvenue sur WhisperHub ! Vérifiez votre e-mail pour commencer 🚀',
            ` 
            <!DOCTYPE html>
            <html lang="fr">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Vérification de votre e-mail</title>
            </head>
            <body style="font-family: Arial, sans-serif; color: #333;">
                <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                    <div style="text-align: center;">
                        <img src="cid:logo@whisperhub" alt="WhisperHub Logo" style="width: 150px; margin-bottom: 10px;">
                    </div>
                    <h1 style="color: #1a202c; text-align: center;">Bienvenue sur <span style="color: #E53E3E;">WhisperHub</span>!</h1>
                    <p style="text-align: center; font-size: 1.1em; color: #4A5568;">
                        Merci de rejoindre notre communauté ! Avant de plonger dans les confessions, il ne vous reste plus qu’une étape.
                    </p>
                    <h2 style="color: #2B6CB0; text-align: center;">🚀 Activez votre compte dès maintenant</h2>
                    <p style="color: #4A5568; line-height: 1.6;">
                        Pour confirmer votre adresse e-mail et accéder à toutes les fonctionnalités de WhisperHub, cliquez simplement sur le bouton ci-dessous :
                    </p>
                    <div style="text-align: center; margin: 20px;">
                        <a href="${verificationUrl}" style="background-color: #2B6CB0; color: white; padding: 12px 20px; text-decoration: none; font-weight: bold; border-radius: 5px;">
                            Vérifier mon e-mail
                        </a>
                    </div>
                    <p style="color: #718096; font-size: 0.9em; text-align: center;">
                        🔒 Cette étape est essentielle pour garantir la sécurité de votre compte et de vos informations.
                    </p>
                    <hr style="margin: 20px 0; border: none; border-top: 1px solid #E2E8F0;">
                    <p style="color: #4A5568; line-height: 1.6;">
                        Nous avons hâte de voir ce que vous partagerez et de vous accompagner dans votre aventure sur WhisperHub ! 
                        Si vous avez des questions, notre équipe est toujours là pour vous.
                    </p>
                    <p style="font-weight: bold; color: #2D3748;">À très bientôt,<br>L’équipe WhisperHub</p>
                    <p style="font-size: 0.9em; color: #A0AEC0;">
                        P.S. Si vous n’avez pas créé de compte, vous pouvez ignorer cet e-mail.
                    </p>
                </div>
            </body>
            </html>
            `
        );                

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
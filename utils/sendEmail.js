const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
    try {
        // Créer un transporteur SMTP avec les informations d'authentification Gmail
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER, // Ton email Gmail
                pass: process.env.GMAIL_APP_PASSWORD // Le mot de passe d'application Gmail
            }
        });

        // Configurer le message email
        const mailOptions = {
            from: process.env.GMAIL_USER, // L'adresse de l'expéditeur (ton email Gmail)
            to, // Destinataire
            subject, // Sujet
            text // Contenu de l'email
        };

        // Envoyer l'email
        const result = await transporter.sendMail(mailOptions);
        console.log('Email envoyé:', result);
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email', error);
        throw new Error('Erreur lors de l\'envoi de l\'email');
    }
};

module.exports = sendEmail;
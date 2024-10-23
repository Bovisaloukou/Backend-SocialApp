const mailgun = require('mailgun-js');

// Configuration du transporteur Mailgun
const mg = mailgun({ 
    apiKey: process.env.MAILGUN_API_KEY,  // Utilisez la clé API privée ici
    domain: process.env.MAILGUN_DOMAIN    // Utilisez votre domaine Mailgun ici
});

const sendEmail = async (to, subject, text) => {
    try {
        const mailOptions = {
            from: 'postmaster@' + process.env.MAILGUN_DOMAIN,  // Utilisez une adresse "from" valide
            to,                                               // Destinataire
            subject,                                          // Sujet de l'email
            text                                              // Contenu de l'email
        };

        // Envoi de l'email avec Mailgun
        const result = await mg.messages().send(mailOptions);
        console.log('Email envoyé :', result);
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email :', error);
        throw new Error('Erreur lors de l\'envoi de l\'email');
    }
};

module.exports = sendEmail;
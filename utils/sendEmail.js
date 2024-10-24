const nodemailer = require('nodemailer');

// Créez un transporteur Nodemailer avec Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,        // Votre adresse email Gmail
    pass: process.env.GMAIL_APP_PASSWORD // Le mot de passe d'application généré
  }
});

const sendEmail = async (to, subject, text) => {
  try {
    const mailOptions = {
      from: process.env.GMAIL_USER,       // Adresse email d'envoi
      to,                                 // Destinataire
      subject,                            // Sujet de l'email
      text                                // Contenu de l'email
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email envoyé :', result);
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email', error);
    throw new Error('Erreur lors de l\'envoi de l\'email');
  }
};

module.exports = sendEmail;
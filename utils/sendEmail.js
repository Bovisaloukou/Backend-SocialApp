const nodemailer = require('nodemailer');

// Créez un transporteur Nodemailer avec Sendinblue
const transporter = nodemailer.createTransport({
  service: 'SendinBlue',
  auth: {
    user: process.env.SENDINBLUE_EMAIL,  // Votre email Sendinblue
    pass: process.env.SENDINBLUE_API_KEY // Votre clé API Sendinblue
  }
});

const sendEmail = async (to, subject, text) => {
  try {
    const mailOptions = {
      from: 'eleonorelysiane@gmail.com',  // L'adresse email d'envoi
      to,                               // Destinataire
      subject,                          // Sujet de l'email
      text                              // Contenu de l'email
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email envoyé :', result);
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email', error);
    throw new Error('Erreur lors de l\'envoi de l\'email');
  }
};

module.exports = sendEmail;
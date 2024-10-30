const nodemailer = require('nodemailer');

// Créez un transporteur Nodemailer avec Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,        // Votre adresse email Gmail
    pass: process.env.GMAIL_APP_PASSWORD // Le mot de passe d'application généré
  }
});

const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: process.env.GMAIL_USER,       // Adresse email d'envoi
      to,                                 // Destinataire
      subject,
      html,
      attachments: [
        {
          filename: 'logo192.png',
          path: path.join(__dirname, 'logo192.png'), // Chemin relatif vers le logo
          cid: 'logo@whisperhub' // cid pour la référence dans le HTML
        }
      ]                                // Contenu de l'email
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email envoyé :', result);
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email', error);
    throw new Error('Erreur lors de l\'envoi de l\'email');
  }
};

module.exports = sendEmail;
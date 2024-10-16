// /config/mailer.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'eleonorelysiane@gmail.com',
        pass: 'Motdepasse2..go'
    }
});

module.exports = transporter;

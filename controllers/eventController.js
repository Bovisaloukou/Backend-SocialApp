// /controllers/eventController.js
const QRCode = require('qrcode');
const Event = require('../models/Event');
const transporter = require('../config/mailer');
const { generateAccessCode } = require('../utils/utils');


// Méthode pour récupérer tous les événements (publics et privés)

exports.getAllEvents = async (req, res) => {
    try {
        console.log('Tentative de récupération des événements...');

        // Récupérer les événements publics
        const publicEvents = await Event.find({ isPrivate: false });
        console.log('Événements publics récupérés:', publicEvents);

        // Récupérer les événements privés où l'utilisateur est invité ou qu'il a créés
        const privateEvents = await Event.find({
            isPrivate: true,
            $or: [
                { createdBy: req.user.id }, // L'utilisateur est le créateur
                { invitedUsers: req.user.id }, // L'utilisateur est dans la liste des invités par ID
                { invitations: req.user.email } // L'utilisateur est dans la liste des invités par email
            ]
        });
        console.log('Événements privés récupérés:', privateEvents);

        res.status(200).json({ publicEvents, privateEvents });
    } catch (error) {
        console.error('Erreur lors de la récupération des événements:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des événements' });
    }
};


// Création d'un événement
exports.createEvent = async (req, res) => {
    try {
        console.log(req.body);  // Vérifiez les données reçues dans la requête

        const { title, description, date, location, isPrivate, invitations, invitedUsers = [] } = req.body;
        const accessCode = isPrivate ? generateAccessCode() : null;

        const newEvent = new Event({
            title, description, date, location,
            isPrivate: isPrivate || false,
            createdBy: req.user.id,
            invitations: isPrivate ? invitations : [],
            invitedUsers: isPrivate ? invitedUsers : [],  // Utilisez une valeur par défaut ici aussi
            accessCode
        });

        await newEvent.save();
        // Log l'événement créé pour vérifier
        console.log('Événement créé :', newEvent);

        /*if (isPrivate && invitedUsers.length > 0) {
            const eventLink = `http://localhost:3000/events/${newEvent._id}?code=${newEvent.accessCode}`;
            for (const email of invitations) {
                const qrCodeDataUrl = await QRCode.toDataURL(eventLink);
                const mailOptions = {
                    from: 'tonemail@gmail.com',
                    to: email,
                    subject: `Invitation à l'événement : ${newEvent.title}`,
                    html: `
                        <h3>Vous êtes invité à l'événement "${newEvent.title}"</h3>
                        <p>${description}</p>
                        <p>Date: ${new Date(date).toLocaleString()}</p>
                        <p>Lien: <a href="${eventLink}">Accéder à l'événement</a></p>
                        <p>Code d'accès : ${accessCode}</p>
                        <img src="${qrCodeDataUrl}" alt="QR Code de l'événement" />
                    `
                };
                await transporter.sendMail(mailOptions);
                console.log(`Invitation envoyée à l'utilisateur ${userId} avec le code QR`);
            }
        }*/

        res.status(201).json({ message: 'Événement créé avec succès', event: newEvent });
    } catch (error) {
        // Gérer et loguer l'erreur
        console.error('Erreur lors de la création de l\'événement:', error);
        res.status(500).json({ error: 'Erreur lors de la création de l\'événement' });
    }
};

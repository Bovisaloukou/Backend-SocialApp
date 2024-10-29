const { Confession, Reply } = require('../models/Confession');
const { upload } = require('../config/cloudinaryConfig'); // Importez le middleware Multer configuré
const mongoose = require('mongoose');

// Créer une nouvelle confession avec ou sans image
exports.createConfession = async (req, res) => {
    try {
        const { content } = req.body;
        let imageUrl = null;

        // Vérifiez si une image est incluse
        if (req.file) {
            imageUrl = req.file.path; // Chemin de l'image sur Cloudinary
        }

        const newConfession = new Confession({
            content,
            imageUrl, // Enregistre l'URL de l'image
        });

        await newConfession.save();
        res.status(201).json(newConfession);
    } catch (error) {
        console.error('Erreur lors de la création de la confession:', error);
        res.status(500).json({ error: 'Erreur lors de la création de la confession' });
    }
};

// Récupérer toutes les confessions et leurs réponses avec pagination
exports.getAllConfessions = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Récupère l'utilisateur connecté
        const userId = req.user ? req.user.id : null;
        console.log("ID de l'utilisateur connecté:", userId); // Ajout du log pour vérifier l'ID utilisateur

        const confessions = await Confession.find()
            .sort({ createdAt: -1 })
            .populate({
                path: 'replies',
                populate: {
                    path: 'replies',
                    populate: { path: 'replies' } // Récupère les sous-réponses jusqu'au 3ème niveau
                }
            })
            .skip(skip)
            .limit(limit)
            .lean();

        // Ajoute `likedByCurrentUser` à chaque confession pour indiquer si l'utilisateur actuel a liké
        confessions.forEach(confession => {
            console.log("ID de l'utilisateur connecté:", userId);
            //console.log("ID des utilisateurs ayant liké:", confession.userLikes); // Log les userLikes pour vérifier

            confession.userLikes = confession.userLikes || [];

            confession.likedByCurrentUser = userId && confession.userLikes.some(
                likeId => likeId.equals(new mongoose.Types.ObjectId(userId)) // Utiliser `.equals()` pour comparer les ObjectId
            );
            console.log(new mongoose.Types.ObjectId(userId));
            console.log(confession.userLikes);
            console.log(confession.likedByCurrentUser);

            // Parcours de chaque réponse dans la confession
            confession.replies = confession.replies.map(reply => {
                reply.userLikes = reply.userLikes || [];  // Initialiser userLikes si indéfini

                // Définir `likedByCurrentUser` pour la réponse
                reply.likedByCurrentUser = userId && reply.userLikes.some(
                    likeId => likeId.equals(new mongoose.Types.ObjectId(userId))
                );

                // Parcours de chaque sous-réponse dans la réponse
                if (reply.replies && Array.isArray(reply.replies)) {
                    reply.replies = reply.replies.map(subReply => {
                        subReply.userLikes = subReply.userLikes || [];  // Initialiser userLikes si indéfini

                        // Définir `likedByCurrentUser` pour la sous-réponse
                        subReply.likedByCurrentUser = userId && subReply.userLikes.some(
                            likeId => likeId.equals(new mongoose.Types.ObjectId(userId))
                        );

                        return subReply;
                    });
                }

                return reply;
            });
        });

        res.status(200).json(confessions);
    } catch (error) {
        console.error('Erreur lors de la récupération des confessions :', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des confessions' });
    }
};

// Ajouter une réponse à une confession
exports.addReply = async (req, res) => {
    try {
        const { content } = req.body;
        const { confessionId } = req.params;

        // Affichage pour débogage
        console.log('Confession ID:', confessionId);
        console.log('Contenu de la requête:', content);

        // Rechercher la confession
        const confession = await Confession.findById(confessionId);
        console.log('Confession trouvée:', confession);  // Vérification

        if (!confession) {
            return res.status(404).json({ error: 'Confession non trouvée' });
        }

        // Assurer que replies est bien un tableau
        if (!Array.isArray(confession.replies)) {
            confession.replies = [];
        }

        // Créer une nouvelle réponse
        const newReply = new Reply({ content });
        await newReply.save();

        // Ajouter la nouvelle réponse
        confession.replies.push(newReply._id);
        await confession.save();

        res.status(201).json(newReply);
    } catch (error) {
        console.error('Erreur lors de l\'ajout de la réponse :', error);
        res.status(500).json({ error: 'Erreur lors de l\'ajout de la réponse' });
    }
};

// Ajouter une sous-réponse à une réponse spécifique
exports.addSubReply = async (req, res) => {
    try {
        const { content } = req.body;
        const { confessionId, replyId } = req.params;

        console.log('Confession ID:', confessionId);
        console.log('Reply ID:', replyId);
        console.log('Contenu de la requête:', content);

        // Trouver la confession
        const confession = await Confession.findById(confessionId);
        console.log('Confession trouvée:', confession);

        if (!confession) {
            return res.status(404).json({ error: 'Confession non trouvée' });
        }

        // Trouver la réponse parent
        const parentReply = await Reply.findById(replyId);
        console.log('Réponse parent trouvée:', parentReply);

        if (!parentReply) {
            return res.status(404).json({ error: 'Réponse parent non trouvée' });
        }

        // Créer la sous-réponse
        const newReply = new Reply({ content });
        await newReply.save();

        // Ajouter la sous-réponse
        if (!Array.isArray(parentReply.replies)) {
            parentReply.replies = [];
        }
        parentReply.replies.push(newReply._id);
        await parentReply.save();

        res.status(201).json(newReply);
    } catch (error) {
        console.error('Erreur lors de l\'ajout de la sous-réponse :', error);
        res.status(500).json({ error: 'Erreur lors de l\'ajout de la sous-réponse' });
    }
};

// Like a confession
exports.likeConfession = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: 'Utilisateur non authentifié.' });
        }

        const { confessionId } = req.params;
        const userId = req.user.id;  // Assuming user is authenticated

        const confession = await Confession.findById(confessionId);
        if (!confession) return res.status(404).json({ error: 'Confession not found' });

        // Toggle like
        const hasLiked = confession.userLikes.includes(userId);
        confession.likes += hasLiked ? -1 : 1;
        if (hasLiked) {
            confession.userLikes.pull(userId);
        } else {
            confession.userLikes.push(userId);
        }

        await confession.save();
        res.status(200).json({ likes: confession.likes });
    } catch (error) {
        console.error('Error liking confession:', error);
        res.status(500).json({ error: 'Error liking confession' });
    }
};

// Like a reply
exports.likeReply = async (req, res) => {
    try {
        const { replyId } = req.params;

        const userId = req.user ? req.user.id : null;
        console.log("ID de l'utilisateur connecté:", userId); // Ajout du log pour vérifier l'ID utilisateur

        console.log("ID de la réponse:", replyId);
        console.log("ID de l'utilisateur:", userId);

        const reply = await Reply.findById(replyId);
        if (!reply) {
            console.log("Réponse non trouvée pour l'ID donné.");
            return res.status(404).json({ error: 'Réponse non trouvée' });
        }

        console.log("Réponse trouvée:", reply);

        // Toggle like
        const hasLiked = reply.userLikes.includes(userId);
        reply.likes += hasLiked ? -1 : 1;
        if (hasLiked) {
            reply.userLikes.pull(userId);
        } else {
            reply.userLikes.push(userId);
        }

        await reply.save();
        res.status(200).json({ likes: reply.likes });
    } catch (error) {
        console.error('Error liking reply:', error);
        res.status(500).json({ error: 'Error liking reply' });
    }
};
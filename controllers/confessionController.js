const { Confession, Reply } = require('../models/Confession');
const { upload } = require('../config/cloudinaryConfig'); // Importez le middleware Multer configuré

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

// Récupérer toutes les confessions et leurs réponses
exports.getAllConfessions = async (req, res) => {
    try {
        const confessions = await Confession.find()
            .sort({ createdAt: -1 })
            .populate({
                path: 'replies',  // Populate les réponses
                populate: { path: 'replies' }  // Populate les sous-réponses
            })
            .lean();  // Convertir le résultat en objet JavaScript simple

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
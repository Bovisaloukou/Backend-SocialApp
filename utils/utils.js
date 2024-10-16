// Génère un code d'accès aléatoire (6 caractères)
function generateAccessCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let accessCode = '';
    for (let i = 0; i < 6; i++) {
        accessCode += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return accessCode;
}

module.exports = { generateAccessCode };

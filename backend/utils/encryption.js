const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
// In production, store this 32-character string in your .env file as VAULT_SECRET
const secretKey = process.env.VAULT_SECRET || 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3'; 

const encrypt = (text) => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    
    // We return both the IV and the encrypted data, as both are needed to decrypt it later
    return { iv: iv.toString('hex'), password: encrypted.toString('hex') };
};

const decrypt = (encryptedData, iv) => {
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey), Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(Buffer.from(encryptedData, 'hex'));
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
};

module.exports = { encrypt, decrypt };
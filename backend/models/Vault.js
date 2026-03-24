const mongoose = require('mongoose');

const vaultSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  website: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true }, // This will be the encrypted string
  iv: { type: String, required: true }        // The initialization vector needed for decryption
}, { timestamps: true });

module.exports = mongoose.model('Vault', vaultSchema);
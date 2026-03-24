// backend/server.js
require('dotenv').config();
const Vault = require('./models/Vault');
const { encrypt, decrypt } = require('./utils/encryption');
const verifyToken = require('./middleware/auth');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:3000', 
    'https://password-manager-frontend-58tc.onrender.com' // Your live frontend
  ],
  credentials: true
}));

// 1. Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/vaultDB')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// 2. Simple User Schema & Model
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true } // This will store the hashed master password
});
const User = mongoose.model('User', userSchema);


// 3. Register Route
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Hash the master password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    // Generate JWT
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET || 'supersecretkey', { expiresIn: '1h' });
    res.status(201).json({ token, message: "Vault created successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error creating account" });
  }
});

// 4. Login Route
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ error: "User not found" });

    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'supersecretkey', { expiresIn: '1h' });
    res.status(200).json({ token, message: "Logged in successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});
// --- VAULT ROUTES ---

// 1. ADD a new password to the vault
app.post('/api/vault', verifyToken, async (req, res) => {
  try {
    const { website, username, password } = req.body;

    // Encrypt the plain text password
    const encryptedData = encrypt(password);

    const newEntry = new Vault({
      userId: req.user.id, // Comes from the verifyToken middleware
      website,
      username,
      password: encryptedData.password,
      iv: encryptedData.iv
    });

    await newEntry.save();
    res.status(201).json({ message: 'Saved to vault successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save credential' });
  }
});

// 2. GET all passwords for the logged-in user
app.get('/api/vault', verifyToken, async (req, res) => {
  try {
    // Find all entries belonging to the user making the request
    const vaultItems = await Vault.find({ userId: req.user.id });

    // Decrypt the passwords before sending them to the frontend
    const decryptedVault = vaultItems.map(item => ({
      _id: item._id,
      website: item.website,
      username: item.username,
      password: decrypt(item.password, item.iv)
    }));

    res.status(200).json(decryptedVault);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve vault' });
  }
});

// UPDATE a password (ADDED BACK IN)
app.put('/api/vault/:id', verifyToken, async (req, res) => {
  try {
    const { website, username, password } = req.body;
    const encryptedData = encrypt(password);

    const updatedEntry = await Vault.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { website, username, password: encryptedData.password, iv: encryptedData.iv },
      { new: true }
    );

    if (!updatedEntry) return res.status(404).json({ error: 'Credential not found' });
    res.status(200).json({ message: 'Vault updated successfully' });
  } catch (error) {
    console.error("Update Password Error:", error);
    res.status(500).json({ error: 'Failed to update credential' });
  }
});

// DELETE a password (ADDED BACK IN)
app.delete('/api/vault/:id', verifyToken, async (req, res) => {
  try {
    const deletedEntry = await Vault.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!deletedEntry) return res.status(404).json({ error: 'Credential not found' });
    res.status(200).json({ message: 'Credential deleted successfully' });
  } catch (error) {
    console.error("Delete Password Error:", error);
    res.status(500).json({ error: 'Failed to delete credential' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
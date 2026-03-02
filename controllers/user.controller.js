const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Liste de tous les utilisateurs
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Détails d'utilisateur
exports.getUserByEmail = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email }).select('-password');
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Création d'utilisateur
exports.createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email déjà utilisé' });

    const user = new User({ username, email, password });
    await user.save();
    res.status(201).json({ message: 'Utilisateur créé', user: { username, email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//Modification d'utilisateur
exports.updateUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    if (username) user.username = username;
    if (password) user.password = await bcrypt.hash(password, 10);
    await user.save();

    res.json({ message: 'Utilisateur mis à jour', user: { username: user.username, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//Suppression d'utilisateur
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ email: req.params.email });
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.json({ message: 'Utilisateur supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
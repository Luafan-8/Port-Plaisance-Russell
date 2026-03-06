// routes/user.routes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const authMiddleware = require('../middlewares/auth.middleware');

router.use(authMiddleware);

// List user
router.get('/', async (req, res) => {
    const users = await User.find();
    res.render('user', { users });
});

// detail user
router.get('/:email', async (req, res) => {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.redirect('/users');
    res.render('userDetail', { user });
});

// creation user
router.post('/', async (req, res) => {
    const { username, email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    await User.create({ username, email, password: hashed });
    res.redirect('/users');
});

// modfication d'user
router.post('/update/:email', async (req, res) => {
    const { username, password } = req.body;
    const updateData = { username };
    if (password) updateData.password = await bcrypt.hash(password, 10);
    await User.findOneAndUpdate({ email: req.params.email }, updateData);
    res.redirect('/users');
});

// supprimer user
router.post('/delete/:email', async (req, res) => {
    await User.deleteOne({ email: req.params.email });
    res.redirect('/users');
});

module.exports = router;
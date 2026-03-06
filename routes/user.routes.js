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
router.post('/create', async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        const user = new User({
            username,
            email,
            password,
            role
        });

        await user.save();

        res.redirect('/users');

    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur création utilisateur');
    }
});

// modfication d'user
router.post('/update/:email', async (req, res) => {
    try {
        const { username, password, role } = req.body;

        const updateData = { username, role };

        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        await User.findOneAndUpdate(
            { email: req.params.email },
            updateData
        );

        res.redirect('/users');

    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur modification');
    }
});

// supprimer user
router.post('/delete/:email', async (req, res) => {
    try {
        await User.deleteOne({ email: req.params.email });
        res.redirect('/users');
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur suppression');
    }
});


module.exports = router;
// routes/auth.routes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const Reservation = require('../models/Reservation');
const authMiddleware = require('../middlewares/auth.middleware');

// PAGE LOGIN
router.get('/login', (req, res) => {
    res.render('login', { error: null });
});

// TRAITEMENT LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        console.log("EMAIL SAISI :", email);
        console.log("USER TROUVÉ :", user);

        if (!user) {
            return res.render('login', { error: 'Email ou mot de passe incorrect.' });
        }

        const match = await bcrypt.compare(password, user.password);

        console.log("PASSWORD SAISI :", password);
        console.log("PASSWORD EN BASE :", user.password);
        console.log("MATCH ?", match);

        if (!match) {
            return res.render('login', { error: 'Email ou mot de passe incorrect.' });
        }

        req.session.user = {
            _id: user._id,
            username: user.username,
            email: user.email
        };

        res.redirect('/dashboard');

    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur serveur');
    }
});

// DASHBOARD
router.get('/dashboard', authMiddleware, async (req, res) => {
    try {
        const today = new Date().toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const reservations = await Reservation.find();

        res.render('dashboard', {
            user: req.session.user,
            date: today,
            reservations: reservations
        });

    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur serveur');
    }
});

// LOGOUT
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).send('Erreur lors de la déconnexion');
        res.redirect('/login');
    });
});

module.exports = router;
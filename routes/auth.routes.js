const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')
const authMiddleware = require('../middlewares/auth.middleware')
const Reservation = require('../models/Reservation');

// PAGE LOGIN
router.get('/login', (req, res) => {
    res.render('login', { error: null })
})

// TRAITEMENT LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.render('login', { error: 'Tous les champs sont requis.' })
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.render('login', { error: 'Email ou mot de passe incorrect.' })
        }

        const match = await bcrypt.compare(password, user.password)
        if (!match) {
            return res.render('login', { error: 'Email ou mot de passe incorrect.' })
        }

        // ✅ Session
        req.session.user = {
            id: user._id,
            username: user.username,
            email: user.email
        }

        // 🔀 Redirection vers dashboard
        res.redirect('/dashboard')

    } catch (error) {
        console.error(error)
        res.status(500).send('Erreur serveur')
    }
})

// DASHBOARD
router.get('/dashboard', authMiddleware, async (req, res) => {
    const today = new Date().toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Récupérer toutes les réservations
    const reservations = await Reservation.find();

    res.render('dashboard', {
        user: req.session.user,
        date: today,
        reservations
    });
});

// LOGOUT
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).send('Erreur lors de la déconnexion')
        res.redirect('/login')
    })
})

module.exports = router
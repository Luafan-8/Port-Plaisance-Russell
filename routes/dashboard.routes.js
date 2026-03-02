const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const Reservation = require('../models/Reservation');

router.use(authMiddleware);

router.get('/', async (req, res) => {
    try {
        const user = req.user;
        const reservations = await Reservation.find().sort({ startDate: 1 }).limit(10);

        res.render('dashboard', {
            user,
            reservations,
            date: new Date().toLocaleDateString()
        });
    } catch(err) {
        console.error(err);
        res.status(500).send('Erreur serveur');
    }
});

module.exports = router;
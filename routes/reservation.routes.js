const express = require('express')
const router = express.Router()
const Reservation = require('../models/Reservation')
const Catway = require('../models/Catway')
const authMiddleware = require('../middlewares/auth.middleware')

//Liste des réservations d’un catway
router.get('/', async (req, res) => {
    try {
        const reservations = await Reservation.find().sort({ startDate: 1 })
        const catways = await Catway.find().sort({ catwayNumber: 1 })

        res.render('reservations', { reservations, catways })
    } catch (err) {
        res.status(500).send('Erreur serveur')
    }
})

//Détail d’une réservation
router.get('/catways/:id/reservations/:idReservation', async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.idReservation)
        if (!reservation) return res.status(404).json({ message: 'Reservation not found' })
        res.json(reservation)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

//Créer une réservation
router.post('/', async (req, res) => {
    try {
        const { catwayNumber, clientName, boatName, startDate, endDate } = req.body

        await Reservation.create({
            catwayNumber,
            clientName,
            boatName,
            startDate,
            endDate
        })

        res.redirect('/reservations')
    } catch (err) {
        res.redirect('/reservations')
    }
})

//Modifier une réservation
router.put('/catways/:id/reservations/:idReservation', async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.idReservation)
        if (!reservation) return res.status(404).json({ message: 'Reservation not found' })

        reservation.clientName = req.body.clientName || reservation.clientName
        reservation.boatName = req.body.boatName || reservation.boatName
        reservation.startDate = req.body.startDate || reservation.startDate
        reservation.endDate = req.body.endDate || reservation.endDate

        const updated = await reservation.save()
        res.json(updated)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

//Supprimer une réservation
router.post('/delete/:id', async (req, res) => {
    try {
        await Reservation.findByIdAndDelete(req.params.id)
        res.redirect('/reservations')
    } catch (err) {
        res.redirect('/reservations')
    }
})

// Page de reservation principale 
router.get('/', authMiddleware, async (req, res) => {
    try {
        const reservations = await Reservation.find()
        res.render('allReservations', { reservations })
    } catch (err) {
        res.status(500).send('Erreur serveur')
    }
})

// PAGE HTML : Liste réservations d’un catway
router.get('/catways/:id/reservations/view', authMiddleware, async (req, res) => {
    try {
        const catway = await Catway.findOne({ catwayNumber: req.params.id })
        if (!catway) return res.redirect('/dashboard')

        const reservations = await Reservation.find({ catwayNumber: req.params.id })

        res.render('reservations', {
            catway,
            reservations
        })
    } catch (err) {
        res.status(500).send('Erreur serveur')
    }
})

// PAGE HTML : Formulaire création
router.get('/catways/:id/reservations/new', authMiddleware, async (req, res) => {
    const catway = await Catway.findOne({ catwayNumber: req.params.id })
    if (!catway) return res.redirect('/dashboard')

    res.render('newReservation', { catway, error: null })
})

router.post('/catways/:id/reservations', authMiddleware, async (req, res) => {
    try {
        const catway = await Catway.findOne({ catwayNumber: req.params.id })
        if (!catway) return res.redirect('/dashboard')

        const { clientName, boatName, startDate, endDate } = req.body

        if (!clientName || !boatName || !startDate || !endDate) {
            return res.render('newReservation', {
                catway,
                error: "Tous les champs sont obligatoires"
            })
        }

        await Reservation.create({
            catwayNumber: req.params.id,
            clientName,
            boatName,
            startDate,
            endDate
        })

        res.redirect(`/reservations/catways/${req.params.id}/reservations/view`)

    } catch (err) {
        res.status(400).send(err.message)
    }
})

module.exports = router
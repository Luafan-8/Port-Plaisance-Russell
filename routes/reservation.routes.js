const express = require('express')
const router = express.Router()
const Reservation = require('../models/Reservation')
const Catway = require('../models/Catway')

//Liste des réservations d’un catway
router.get('/catways/:id/reservations', async (req, res) => {
    try {
        const reservations = await Reservation.find({ catwayNumber: req.params.id })
        res.json(reservations)
    } catch (err) {
        res.status(500).json({ message: err.message })
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
router.post('/catways/:id/reservations', async (req, res) => {
    try {
        const catway = await Catway.findOne({ catwayNumber: req.params.id })
        if (!catway) return res.status(404).json({ message: 'Catway not found' })

        const reservation = new Reservation({
            catwayNumber: req.params.id,
            clientName: req.body.clientName,
            boatName: req.body.boatName,
            startDate: req.body.startDate,
            endDate: req.body.endDate
        })

        const newReservation = await reservation.save()
        res.status(201).json(newReservation)
    } catch (err) {
        res.status(400).json({ message: err.message })
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
router.delete('/catways/:id/reservations/:idReservation', async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.idReservation)
        if (!reservation) return res.status(404).json({ message: 'Reservation not found' })

        await reservation.deleteOne()
        res.json({ message: 'Reservation deleted' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

module.exports = router
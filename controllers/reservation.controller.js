const Reservation = require('../models/Reservation')

exports.getAllReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find()
        res.status(200).json(reservations)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.getReservationById = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id)
        if (!reservation) return res.status(404).json({ message: "Réservation non trouvée" })
        res.status(200).json(reservation)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.createReservation = async (req, res) => {
    try {
        const newReservation = await Reservation.create(req.body)
        res.status(201).json(newReservation)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

exports.updateReservation = async (req, res) => {
    try {
        const updated = await Reservation.findByIdAndUpdate(req.params.id, req.body, { new: true })
        if (!updated) return res.status(404).json({ message: "Réservation non trouvée" })
        res.status(200).json(updated)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

exports.deleteReservation = async (req, res) => {
    try {
        const deleted = await Reservation.findByIdAndDelete(req.params.id)
        if (!deleted) return res.status(404).json({ message: "Réservation non trouvée" })
        res.status(200).json({ message: "Réservation supprimée" })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

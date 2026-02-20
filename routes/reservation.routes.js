const express = require('express')
const router = express.Router()
const reservationController = require('../controllers/reservation.controller')
const authMiddleware = require('../middlewares/auth.middleware')

router.get('/api/reservations', authMiddleware, reservationController.getAllReservations)
router.get('/api/reservations/:id', authMiddleware, reservationController.getReservationById)
router.post('/api/reservations', authMiddleware, reservationController.createReservation)
router.put('/api/reservations/:id', authMiddleware, reservationController.updateReservation)
router.delete('/api/reservations/:id', authMiddleware, reservationController.deleteReservation)

module.exports = router

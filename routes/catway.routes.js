const express = require('express')
const router = express.Router()
const catwayController = require('../controllers/catway.controller')
const authMiddleware = require('../middlewares/auth.middleware')

router.get('/api/catways', authMiddleware, catwayController.getAllCatways)
router.get('/api/catways/:id', authMiddleware, catwayController.getCatwayById)
router.post('/api/catways', authMiddleware, catwayController.createCatway)
router.put('/api/catways/:id', authMiddleware, catwayController.updateCatway)
router.delete('/api/catways/:id', authMiddleware, catwayController.deleteCatway)

module.exports = router

const express = require('express')
const router = express.Router()
const Catway = require('../models/Catway')
const authMiddleware = require('../middlewares/auth.middleware')

router.use(authMiddleware)

/* =========================================
   GET /catways
   Lister tous les catways
========================================= */
router.get('/catways', async (req, res) => {
    try {
        const catways = await Catway.find()
        res.json(catways)
    } catch (err) {
        res.status(500).json({ message: 'Erreur serveur' })
    }
})

/* =========================================
   GET /catways/:id
   Détails d’un catway
========================================= */
router.get('/catways/:id', async (req, res) => {
    try {
        const catway = await Catway.findOne({ catwayNumber: req.params.id })

        if (!catway)
            return res.status(404).json({ message: 'Catway non trouvé' })

        res.json(catway)
    } catch (err) {
        res.status(500).json({ message: 'Erreur serveur' })
    }
})

/* =========================================
   POST /catways
   Créer un catway
========================================= */
router.post('/catways', async (req, res) => {
    try {
        const { catwayNumber, catwayType, catwayState } = req.body

        const existing = await Catway.findOne({ catwayNumber })
        if (existing)
            return res.status(400).json({ message: 'Ce numéro existe déjà' })

        const newCatway = await Catway.create({
            catwayNumber,
            catwayType,
            catwayState
        })

        res.status(201).json(newCatway)
    } catch (err) {
        res.status(400).json({ message: 'Données invalides' })
    }
})

/* =========================================
   PUT /catways/:id
   Modifier UNIQUEMENT l’état
========================================= */
router.put('/catways/:id', async (req, res) => {
    try {
        const updated = await Catway.findOneAndUpdate(
            { catwayNumber: req.params.id },
            { catwayState: req.body.catwayState },
            { new: true }
        )

        if (!updated)
            return res.status(404).json({ message: 'Catway non trouvé' })

        res.json(updated)
    } catch (err) {
        res.status(400).json({ message: 'Erreur modification' })
    }
})

/* =========================================
   DELETE /catways/:id
   Supprimer un catway
========================================= */
router.delete('/catways/:id', async (req, res) => {
    try {
        const deleted = await Catway.findOneAndDelete({
            catwayNumber: req.params.id
        })

        if (!deleted)
            return res.status(404).json({ message: 'Catway non trouvé' })

        res.json({ message: 'Catway supprimé' })
    } catch (err) {
        res.status(500).json({ message: 'Erreur suppression' })
    }
})

module.exports = router
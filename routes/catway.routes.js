const express = require('express')
const router = express.Router()
const Catway = require('../models/Catway')
const authMiddleware = require('../middlewares/auth.middleware')

router.use(authMiddleware)

/* GET Afficher la page avec la liste */
router.get('/', async (req, res) => {
    try {
        const catways = await Catway.find().sort({ catwayNumber: 1 })
        res.render('catways', { catways })
    } catch (err) {
        res.status(500).send('Erreur serveur')
    }
})

/* POST Créer un catway */
router.post('/', async (req, res) => {
    try {
        const { catwayNumber, catwayType, catwayState } = req.body

        const existing = await Catway.findOne({ catwayNumber })
        if (existing)
            return res.redirect('/catways')

        await Catway.create({
            catwayNumber,
            catwayType,
            catwayState
        })

        res.redirect('/catways')
    } catch (err) {
        res.redirect('/catways')
    }
})

/* POST update/:id Modifier uniquement l’état */
router.post('/update/:id', async (req, res) => {
    try {
        await Catway.findOneAndUpdate(
            { catwayNumber: req.params.id },
            { catwayState: req.body.catwayState }
        )

        res.redirect('/catways')
    } catch (err) {
        res.redirect('/catways')
    }
})

/* POST /delete/:id Supprimer un catway*/
router.post('/delete/:id', async (req, res) => {
    try {
        await Catway.findOneAndDelete({
            catwayNumber: req.params.id
        })

        res.redirect('/catways')
    } catch (err) {
        res.redirect('/catways')
    }
})

module.exports = router
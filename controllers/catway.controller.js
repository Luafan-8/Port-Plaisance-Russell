const Catway = require('../models/Catways')

exports.getAllCatways = async (req, res) => {
    try {
        const catways = await Catway.find()
        res.status(200).json(catways)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.getCatwayById = async (req, res) => {
    try {
        const catway = await Catway.findById(req.params.id)
        if (!catway) return res.status(404).json({ message: "Catway non trouvé" })
        res.status(200).json(catway)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.createCatway = async (req, res) => {
    try {
        const newCatway = await Catway.create(req.body)
        res.status(201).json(newCatway)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

exports.updateCatway = async (req, res) => {
    try {
        const updated = await Catway.findByIdAndUpdate(req.params.id, req.body, { new: true })
        if (!updated) return res.status(404).json({ message: "Catway non trouvé" })
        res.status(200).json(updated)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

exports.deleteCatway = async (req, res) => {
    try {
        const deleted = await Catway.findByIdAndDelete(req.params.id)
        if (!deleted) return res.status(404).json({ message: "Catway non trouvé" })
        res.status(200).json({ message: "Catway supprimé" })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

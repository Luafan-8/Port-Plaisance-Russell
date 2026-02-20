const mongoose = require('mongoose')

const catwaySchema = new mongoose.Schema({
    catwayNumber: Number,
    catwayType: String,
    catwayState: String
})

module.exports = mongoose.model('Catway', catwaySchema)

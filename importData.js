require('dotenv').config()
const mongoose = require('mongoose')
const fs = require('fs')

const Catway = require('./models/Catway')
const Reservation = require('./models/Reservation')

mongoose.connect(process.env.MONGO_URI)
.then(async () => {

    const catways = JSON.parse(fs.readFileSync('./catways.json', 'utf-8'))
    const reservations = JSON.parse(fs.readFileSync('./reservations.json', 'utf-8'))

    await Catway.insertMany(catways)
    await Reservation.insertMany(reservations)

    console.log("Données importées avec succès")
    process.exit()

})
.catch(err => console.log(err))

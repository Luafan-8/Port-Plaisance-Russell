require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')

const authRoutes = require('./routes/auth.routes')
const authMiddleware = require('./middlewares/auth.middleware')
const Catway = require('./models/Catways')
const catwayRoutes = require('./routes/catway.routes')

const reservationRoutes = require('./routes/reservation.routes')

const app = express()

//middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.set('view engine', 'ejs')

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connecté"))
.catch(err => console.log(err))

//routes
app.use('/', authRoutes)
app.use(catwayRoutes)
app.use(reservationRoutes)

app.get('/', (req, res) => {
    res.render('login')
})

app.get('/dashboard', authMiddleware, async (req, res) => {
    const catways = await Catway.find()
    res.render('dashboard', { catways })
})

app.listen(3000, () => {
    console.log("Serveur lancé sur le port 3000")
})


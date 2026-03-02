require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();

// Connexion MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connecté'))
  .catch(err => console.error(err));

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(cookieParser());

// 🔑 Session DOIT être avant les routes
app.use(session({
    secret: 'monsecret',
    resave: false,
    saveUninitialized: false
}));

app.use(express.static('public'));
app.set('view engine', 'ejs');

// Routes
app.use('/', require('./routes/auth.routes'));
app.use('/users', require('./routes/user.route'));
app.use('/catways', require('./routes/catway.routes'));
app.use('/reservations', require('./routes/reservation.routes'));
// Pas besoin de /dashboard séparé si défini dans auth.routes

// Page d'accueil
app.get('/', (req, res) => res.render('index'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
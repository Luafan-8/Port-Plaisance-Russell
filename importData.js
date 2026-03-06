require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const Catway = require('./models/Catway');
const Reservation = require('./models/Reservation');

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connecté pour import '))
  .catch(err => {
      console.error('Erreur connexion', err);
      process.exit(1);
  });

async function importData() {
    try {
        // ===== USERS =====
        const usersPath = path.join(__dirname, 'data', 'users.json');
        if (fs.existsSync(usersPath)) {
            const usersData = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
            for (let u of usersData) {
                const exists = await User.findOne({ email: u.email });
                if (!exists) {
                    u.password = await bcrypt.hash(u.password, 10);
                    await new User(u).save();
                }
            }
            console.log('Users importés ');
        }

        // ===== CATWAYS =====
        const catwaysPath = path.join(__dirname, 'data', 'catways.json');
        if (fs.existsSync(catwaysPath)) {
            const catwaysData = JSON.parse(fs.readFileSync(catwaysPath, 'utf-8'));
            for (let c of catwaysData) {
                const exists = await Catway.findOne({ catwayNumber: c.catwayNumber });
                if (!exists) await new Catway(c).save();
            }
            console.log('Catways importés ');
        }

        // ===== RESERVATIONS =====
        const reservationsPath = path.join(__dirname, 'data', 'reservations.json');
        if (fs.existsSync(reservationsPath)) {
            const reservationsData = JSON.parse(fs.readFileSync(reservationsPath, 'utf-8'));
            for (let r of reservationsData) {
                const exists = await Reservation.findOne({ catwayNumber: r.catwayNumber, clientName: r.clientName });
                if (!exists) await new Reservation(r).save();
            }
            console.log('Réservations importées ');
        }

        console.log('Importation terminée');
        process.exit(0);
    } catch (err) {
        console.error('Erreur lors de l\'import', err);
        process.exit(1);
    }
}

importData();
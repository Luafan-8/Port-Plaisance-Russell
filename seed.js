require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const User = require('./models/User');
const Catway = require('./models/Catway');
const Reservation = require('./models/Reservation');
const bcrypt = require('bcryptjs');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connecté pour seed'))
  .catch(err => console.error(err));

async function seed() {
    try {
        // Users
        const users = [
            { username: 'admin', email: 'admin@russell.com', password: 'admin123' },
            { username: 'user01', email: 'user01@russell.com', password: 'user01pass123' }
        ];

        for(let u of users){
            const exists = await User.findOne({ email: u.email });
            if(!exists){
                u.password = await bcrypt.hash(u.password, 10);
                await new User(u).save();
            }
        }

        // Catways
        const catwaysData = JSON.parse(fs.readFileSync(path.join(__dirname,'data','catways.json'),'utf-8'));
        for(let c of catwaysData){
            const exists = await Catway.findOne({ catwayNumber: c.catwayNumber });
            if(!exists) await new Catway(c).save();
        }

        // Reservations
        const reservationsData = JSON.parse(fs.readFileSync(path.join(__dirname,'data','reservations.json'),'utf-8'));
        for(let r of reservationsData){
            const exists = await Reservation.findOne({ catwayNumber: r.catwayNumber, clientName: r.clientName });
            if(!exists) await new Reservation(r).save();
        }

        console.log('Seed terminé ✅');
        process.exit();
    } catch(err){
        console.error(err);
        process.exit(1);
    }
}

seed();
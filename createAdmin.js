require('dotenv').config()
const mongoose = require('mongoose')
const User = require('./models/User')

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Connecté à MongoDB'))
.catch(err => console.log(err))

const createAdmin = async () => {
    try {

        const existing = await User.findOne({ email: 'admin@russell.com' })

        if (existing) {
            console.log('Admin existe déjà')
            process.exit()
        }

        const admin = new User({
            username: 'admin',
            email: 'admin@russell.com',
            password: 'admin123'
        })

        await admin.save()

        console.log('Admin créé avec succès')
        process.exit()

    } catch (error) {
        console.error(error)
        process.exit()
    }
}

createAdmin()
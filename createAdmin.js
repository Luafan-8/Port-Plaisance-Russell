require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const User = require('./models/User')

mongoose.connect(process.env.MONGO_URI)
.then(async () => {

    const hashedPassword = await bcrypt.hash("Admin123!", 10)

    await User.create({
        name: "Admin",
        email: "admin@russell.com",
        password: hashedPassword,
        role: "admin"
    })

    console.log("Admin créé")
    process.exit()
})
.catch(err => console.log(err))

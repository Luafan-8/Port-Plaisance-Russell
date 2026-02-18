const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.login = async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await User.findOne({ email })
        if (!user) return res.status(404).send("Utilisateur non trouvé")

        const valid = await bcrypt.compare(password, user.password)
        if (!valid) return res.status(401).send("Mot de passe incorrect")

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        )

        res.cookie("token", token)
        res.redirect('/dashboard')

    } catch (err) {
        res.status(500).send(err.message)
    }
}

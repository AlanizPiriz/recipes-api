const express = require('express')
const router = express.Router()
const { login } = require('../controllers/authController')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

// Login admin (ya lo tenías)
router.post('/login', login)

// Register usuario
router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body

        const yaExiste = await User.findOne({ email })
        if (yaExiste) return res.status(400).json({ error: 'El email ya está registrado' })

        const user = new User({ email, password })
        await user.save()

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

        res.json({ token, user: { id: user._id, email: user.email, plan: user.plan } })

    } catch (err) {
        res.status(500).json({ error: 'Error al registrar' })
    }
})

// Login usuario
router.post('/user/login', async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email })
        if (!user) return res.status(400).json({ error: 'Email o contraseña incorrectos' })

        const passwordOk = await bcrypt.compare(password, user.password)
        if (!passwordOk) return res.status(400).json({ error: 'Email o contraseña incorrectos' })

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

        res.json({ token, user: { id: user._id, email: user.email, plan: user.plan } })

    } catch (err) {
        res.status(500).json({ error: 'Error al iniciar sesión' })
    }
})

module.exports = router
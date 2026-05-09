const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const ADMIN_USER = 'admin'
const ADMIN_PASSWORD_HASH = bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10)

const login = (req, res) => {
    const { usuario, password } = req.body

    if (usuario !== ADMIN_USER) {
        return res.status(401).json({ error: 'Credenciales inválidas' })
    }

    const passwordValida = bcrypt.compareSync(password, ADMIN_PASSWORD_HASH)

    if (!passwordValida) {
        return res.status(401).json({ error: 'Credenciales inválidas' })
    }

    const token = jwt.sign(
        { usuario: ADMIN_USER },
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
    )

    res.json({ token })
}

module.exports = { login }
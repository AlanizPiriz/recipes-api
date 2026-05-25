const jwt = require('jsonwebtoken')

const verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization']

    if (!authHeader) {
        return res.status(401).json({ error: 'Acceso denegado, token requerido' })
    }

    // El header viene como "Bearer eltoken123..."
    const token = authHeader.startsWith('Bearer ') 
        ? authHeader.slice(7) 
        : authHeader

    try {
        const verificado = jwt.verify(token, process.env.JWT_SECRET)
        req.usuario = verificado
        next()
    } catch (err) {
        res.status(401).json({ error: 'Token inválido' })
    }
}

module.exports = verificarToken
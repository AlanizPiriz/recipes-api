const express = require('express')
const router = express.Router()
const User = require('../models/User')
const verificarToken = require('../middleware/auth')

// Obtener favoritos
router.get('/:id/favorites', verificarToken, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('favorites')
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' })
        res.json(user.favorites)
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener favoritos' })
    }
})

// Agregar favorito
router.post('/:id/favorites', verificarToken, async (req, res) => {
    try {
        const { recipeId } = req.body
        const user = await User.findById(req.params.id)
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' })

        if (!user.favorites.includes(recipeId)) {
            user.favorites.push(recipeId)
            await user.save()
        }

        res.json({ message: 'Agregado a favoritos' })
    } catch (err) {
        res.status(500).json({ error: 'Error al agregar favorito' })
    }
})

// Quitar favorito
router.delete('/:id/favorites/:recipeId', verificarToken, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' })

        user.favorites = user.favorites.filter(
            fav => fav.toString() !== req.params.recipeId
        )
        await user.save()

        res.json({ message: 'Quitado de favoritos' })
    } catch (err) {
        res.status(500).json({ error: 'Error al quitar favorito' })
    }
})

module.exports = router
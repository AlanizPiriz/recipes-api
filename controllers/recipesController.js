const Recipe = require('../models/Recipe')

// GET /api/recipes
const getAll = async (req, res) => {
  try {
    const { q } = req.query
    let filter = {}

    if (q) {
      const terminos = q.split(',').map(t => t.trim())
      filter = {
        $and: terminos.map(t => ({
          ingredients: { $regex: t, $options: 'i' }
        }))
      }
    }

    const recipes = await Recipe.find(filter)
    res.json(recipes)
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener recetas' })
  }
}

// GET /api/recipes/:id
const getById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
    if (!recipe) return res.status(404).json({ error: 'Receta no encontrada' })
    res.json(recipe)
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener receta' })
  }
}

// POST /api/recipes
const create = async (req, res) => {
  try {
    const recipe = new Recipe(req.body)
    await recipe.save()
    res.status(201).json(recipe)
  } catch (err) {
    res.status(400).json({ error: 'Error al crear receta' })
  }
}

// PUT /api/recipes/:id
const update = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!recipe) return res.status(404).json({ error: 'Receta no encontrada' })
    res.json(recipe)
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar receta' })
  }
}

// DELETE /api/recipes/:id
const remove = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id)
    if (!recipe) return res.status(404).json({ error: 'Receta no encontrada' })
    res.status(204).send()
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar receta' })
  }
}

// GET /api/recipes/random
const getRandom = async (req, res) => {
  try {
    const count = await Recipe.countDocuments()
    const random = Math.floor(Math.random() * count)
    const recipe = await Recipe.findOne().skip(random)
    res.json(recipe)
  } catch (err) {
    res.status(500).json({error: 'Error al tener receta aleatora' })
  }                                                                                                                                                                                                                                                                                                                                                                                 
}

module.exports = { getAll, getById, create, update, remove, getRandom }
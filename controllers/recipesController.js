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
    const { exclude, tags } = req.query
    const filter = {}
    if (exclude) filter._id = { $ne: exclude }
    if (tags) {
      const lista = tags.split(',')
      filter.tags = { $all: lista }
    }
    
    const count = await Recipe.countDocuments(filter)
    if (count === 0) return res.status(404).json({ error: 'No hay recetas con ese filtro' })
    
    const random = Math.floor(Math.random() * count)
    const recipe = await Recipe.findOne(filter).skip(random)
    res.json(recipe)
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener receta aleatoria' })
  }
}


//carga masiva
const bulkCreate = async (req, res) => {
  try {
    const recipes = await Recipe.insertMany(req.body)
    res.status(201).json({ insertadas: recipes.length, recipes })
  } catch (err) {
    res.status(400).json({ error: 'Error al insertar recetas' })
  }
}

const getWeekly = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 5
    const { tag } = req.query

    const filter = tag ? { tags: tag } : {}
    const todas = await Recipe.find(filter)
    if (todas.length < days) return res.status(400).json({ error: 'No hay suficientes recetas con ese filtro' })

    // Extraer palabra clave de cada ingrediente (última palabra significativa)
    const palabrasClave = (ingredientes) => ingredientes.map(ing => 
      ing.toLowerCase().replace(/[0-9]/g, '').replace(/g|ml|kg|l|taza|cucharada|cucharadita|feta|diente|hoja|sobre|lata|unidad/g, '').trim().split(' ').filter(p => p.length > 2).pop() || ''
    ).filter(Boolean)

    // Elegir receta base random
    const base = todas[Math.floor(Math.random() * todas.length)]
    const baseKeywords = palabrasClave(base.ingredients)
    const seleccionadas = [base]
    const restantes = todas.filter(r => r._id.toString() !== base._id.toString())

    // Puntuar por ingredientes en común
    const conPuntaje = restantes.map(receta => {
      const keywords = palabrasClave(receta.ingredients)
      const comunes = keywords.filter(k => baseKeywords.includes(k)).length
      return { receta, comunes }
    })

    conPuntaje.sort((a, b) => b.comunes - a.comunes)

    for (let i = 0; i < days - 1; i++) {
      if (conPuntaje[i]) seleccionadas.push(conPuntaje[i].receta)
    }

    res.json(seleccionadas)
  } catch (err) {
    res.status(500).json({ error: 'Error al generar menú semanal' })
  }
}

module.exports = { getAll, getById, create, update, remove, getRandom, bulkCreate, getWeekly }
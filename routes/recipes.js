const express = require('express')
const router = express.Router()
const { getAll, getById, create, update, remove, getRandom, bulkCreate, getWeekly } = require('../controllers/recipesController')
const verificarToken = require('../middleware/auth')

router.post('/bulk', verificarToken, bulkCreate)
router.get('/',        getAll)
router.get('/random',  getRandom)
router.get('/weekly', getWeekly)
router.get('/fix-images', async (req, res) => {
  try {
    const recetas = await Recipe.find({});
    
    for (const receta of recetas) {
      if (receta.image && receta.image.split('?').length > 2) {
        const partes = receta.image.split('?');
        receta.image = partes[0] + '?' + partes[1];
        await receta.save();
      }
    }
    
    res.json({ mensaje: 'Listo!', total: recetas.length });
  } catch (error) {
    res.json({ error: error.message });
  }
});
router.get('/:id',     getById)
router.post('/',       verificarToken, create)
router.put('/:id',     verificarToken, update)
router.delete('/:id',  verificarToken, remove)





module.exports = router
const express = require('express')
const router = express.Router()
const { getAll, getById, create, update, remove, getRandom, bulkCreate } = require('../controllers/recipesController')
const verificarToken = require('../middleware/auth')

router.post('/bulk', verificarToken, bulkCreate)
router.get('/',        getAll)
router.get('/random',  getRandom)
router.get('/:id',     getById)
router.post('/',       verificarToken, create)
router.put('/:id',     verificarToken, update)
router.delete('/:id',  verificarToken, remove)

module.exports = router
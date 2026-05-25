require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const recipesRouter = require('./routes/recipes')
const authRouter = require('./routes/auth')
const usersRouter = require('./routes/users')

const app = express()
const PORT = process.env.PORT || 3001

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.log('Error:', err))

app.use(cors())
app.use(express.json())

app.use('/api/recipes', recipesRouter)
app.use('/api/auth', authRouter)

app.use('/api/users', usersRouter)

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})
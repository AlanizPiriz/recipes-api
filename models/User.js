const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    email: { 
        type: String, 
        required: true, 
        unique: true,
        lowercase: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    plan: { 
        type: String, 
        default: 'free' 
    },
    favorites: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Recipe' 
    }],
    menuSemanal: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Recipe' 
    }]
}, { timestamps: true })

// Hashear password antes de guardar
userSchema.pre('save', async function() {
    if (!this.isModified('password')) return
    this.password = await bcrypt.hash(this.password, 10)
})

module.exports = mongoose.model('User', userSchema)
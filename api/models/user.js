const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const { isEmail } = require('validator')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    isCustomer: Boolean,
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: true,
        validate: [isEmail, 'verificar email'],
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        default: "User"
    },
    date: {
        type: Date,
        default: Date.now
    }

})

userSchema.methods.generateJWT = async function () {
    //revisar como se obtiente process.env.SECRET_KEY_JWT_CAR_API
    var SECRET_KEY_JWT_CAR_API = "password"
    return jwt.sign({
        _id: this._id,
        name: this.name,
        isAdmin: this.isAdmin,
        role:this.role
    }, SECRET_KEY_JWT_CAR_API)
}

const User = mongoose.model('user', userSchema)

module.exports = User
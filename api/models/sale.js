const mongoose = require('mongoose')

const saleSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        car: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'car',
            required:true
        },
        price: Number,
        date: { type: Date, default: Date.now }
    }
)

const Sale = mongoose.model('sale', saleSchema)
module.exports = Sale
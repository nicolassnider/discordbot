const mongoose=require('mongoose')

const guildSchema = new mongoose.Schema({
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'guild'
    },
    model: {
        type: String,
        required: true,
        uppercase: true,
        trim: true,
        minlength: 2,
        maxlength: 99        
    },
    sold: {
        type: Boolean,
        required: true
    },
    price: {
        type: Number,
        required: function () {
            return this.sold
        }
    },
    year: {
        type:Number,
        min: 2000,
        max: 2030
    },
    extras:[String],
    date:{type:Date,default:Date.now
    }
})

const Guild=mongoose.model('guild',guildSchema)

module.exports=Guild
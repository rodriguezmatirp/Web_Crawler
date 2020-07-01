const mongoose = require('mongoose')

const dataSchema = new mongoose.Schema({
    heading: {
        type: Array,
        trim: true,
        required: true
    },
    website: {
        type: String,
        unique: true
    },
    lastModDate: {
        type: Date,
    }
}, {
    timestamps: true
})

const data = mongoose.model('data', dataSchema)

module.exports = data
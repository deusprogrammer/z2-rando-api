const mongoose = require('mongoose')

let seedSchema = new mongoose.Schema({
    title: {
        type: String,
        required: 'Title is required'
    },
    seedNumber: {
        type: String,
        required: 'Seed Number is required'
    },
    flags: {
        type: String,
        required: 'Flags are required'
    },
    hash: {
        type: String,
        required: 'Hash is required'
    },
    mediaUrl: {
        type: String
    },
    difficulty: {
        type: Number
    },
    description: {
        type: String
    },
    ownerId: {
        type: String,
        required: 'Owner Id is required'
    },
    ownerUsername: {
        type: String,
        required: 'Owner Username is required'
    },
})

module.exports = mongoose.model("seeds", seedSchema)
const mongoose = require('mongoose')

// Schema for Notes
const NotesSchema = new mongoose.Schema({
    note:{
        type: String,
        required: true
    },
    title:{
        type: String,
        required: true
    },
    description:{
        type: String
    },
    subject:{
        type: String
    },
    verified:{
        type: Boolean,
        default: false
    },
    by:{
        type: String,
        required: true
    },
   date:{
    type: Date,
    default: Date.now
   }
})

// Modal for Notes
const Notes = mongoose.model('notes', NotesSchema)
module.exports = Notes
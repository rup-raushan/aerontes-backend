const mongoose = require('mongoose')

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
   by:{
        type: String,
        required: true
   },
   date:{
    type: Date,
    default: Date.now
   }
})

const Notes = mongoose.model('notes', NotesSchema)
module.exports = Notes
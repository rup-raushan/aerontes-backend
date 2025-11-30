const mongoose = require('mongoose')

// Schema for Notes
const FeedbackSchema = new mongoose.Schema({
    name:{
        type: String,
        default: "Unknown",
        required: true
    },
    message:{
        type: String,
        default: "",
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    }
})

// Modal for Notes
const Feedback = mongoose.model('feedback', FeedbackSchema)
module.exports = Feedback
const mongoose = require('mongoose')

// Schema for a normal user
const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    username:{
        type: String,
        unique: true,
        required: true
    },
    email:{
        type: String,
        unique: true,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    class:{
        type: Number,
        default: 8
    },
    gender:{
        type: String,
        default: "M"
    },
    rollno: {
        type: Number,
        default: 0
    },
    date:{
        type: Date,
        default: Date.now
    }
})

// Modal of User
const User =  mongoose.model("User", UserSchema)
module.exports = User;
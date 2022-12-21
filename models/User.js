const mongoose = require('mongoose')

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
    confirmPassword:{
        type: String
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

const User =  mongoose.model("User", UserSchema)
module.exports = User;
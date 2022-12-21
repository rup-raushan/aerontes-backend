const mongoose = require('mongoose')

const ManagerSchema = new mongoose.Schema({
    name:{
        type: String,
        requird: true
    },
    managerID:{
        type: String,
        required: true,
        unique: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
    },
    code:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    }
})

const Manager = mongoose.model("manager", ManagerSchema)

module.exports = Manager
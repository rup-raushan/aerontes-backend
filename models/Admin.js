const mongoose = require('mongoose')

// Schema for a admin
const AdminSchema = new mongoose.Schema({
    name:{
        type: String,
        requird: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    adminID:{
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

// Creating a modal for admin
const Admin = mongoose.model('admin', AdminSchema)
module.exports = Admin
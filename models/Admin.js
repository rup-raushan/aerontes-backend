const mongoose = require('mongoose')

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

const Admin = mongoose.model('admin', AdminSchema)
module.exports = Admin
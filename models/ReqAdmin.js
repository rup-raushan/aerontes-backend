const mongoose = require('mongoose')

const ReqAdminSchema = new mongoose.Schema({
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

const ReqAdmin = mongoose.model('reqAdmin', ReqAdminSchema)
module.exports = ReqAdmin
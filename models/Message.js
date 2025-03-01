const mongoose = require("mongoose")

const MessageSchema = new mongoose.Schema({
    name:{
        type: String,
        default: "Unkown"
    }
})
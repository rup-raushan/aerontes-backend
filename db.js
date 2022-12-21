const mongoose = require('mongoose');
const mongooseURI = "mongodb://localhost:27017/aeronotes"

const connectToMongo =()=>{
    mongoose.connect(mongooseURI,()=>{
        console.log("Connented to Mongo successfully.")
    })
}


module.exports = {connectToMongo};
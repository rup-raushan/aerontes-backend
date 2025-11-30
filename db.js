const mongoose = require('mongoose');
const mongooseURI = "mongodb+srv://aeronotes:Rup%402907@aerontoes.jzbyyws.mongodb.net/test/?appName=Aerontoes"
// const mongooseURI = "mongodb://localhost:27017/aeronotes"

// Function for connecting to database through mongoose
const connectToMongo =()=>{
    mongoose.connect(mongooseURI,(err)=>{
        if(err) console.log(err)
        else console.log("Successfully connect to Database.")
    })
}


module.exports = {connectToMongo};
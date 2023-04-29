const mongoose = require('mongoose');
// const mongooseURI = "mongodb+srv://rup:Rup%402907@aeronotes.riymjql.mongodb.net/aeronotes?retryWrites=true&w=majority"
const mongooseURI = "mongodb://localhost:27017/aeronotes"

// Function for connecting to database through mongoose
const connectToMongo =()=>{
    mongoose.connect(mongooseURI,(err)=>{
        if(err) console.log(err)
        else console.log("Successfully connect to Database.")
    })
}


module.exports = {connectToMongo};
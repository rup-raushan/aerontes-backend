const mongoose = require('mongoose');
const mongooseURI = "mongodb+srv://rup:Rup%402907@aeronotes.riymjql.mongodb.net/aeronotes?retryWrites=true&w=majority"
const connectToMongo =()=>{
    mongoose.connect(mongooseURI,(err)=>{
        if(err){
            console.log(err)
        }else{
           console.log("Connented to Mongo successfully.")
        }
    })
}


module.exports = {connectToMongo};
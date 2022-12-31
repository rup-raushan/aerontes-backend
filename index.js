const {connectToMongo} = require("./db")
const express = require('express')
const app = express()
const dotenv = require('dotenv')
const PORT = 2907
const cors = require("cors")
const bodyParser = require('body-parser')
dotenv.config();
connectToMongo()

app.use(cors({
    origin: "*", 
    credentials:true,  
    preflightContinue: true
}))

app.get('/',(req,res)=>{
    try {
        res.json({greeting: "Hello and welcome to the aeronotes the world class social notes sharing app for all the students of class 8th."})
    } catch (error) {
        console.log(error)
        res.status(500).json({error: "Some Internal Error Occured"})
    }
})

app.use(bodyParser.json({limit:'50mb'})); 
app.use(express.json())
// Route for user
app.use("/api/auth", require("./routes/auth"))
// Route for notes
app.use('/api/notes', require('./routes/notes'))
// Routes for admin
app.use("/api/admin", require("./routes/admin"))
// routes for manager
app.use("/api/manager", require("./routes/manager"))

app.listen(PORT,()=>{
    console.log(`App is running successfully on the https://localhost:${PORT}`)
})
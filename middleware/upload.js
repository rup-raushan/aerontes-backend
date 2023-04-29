// Creating a middleware for uploading notes' pdf in uploads folder
// Here multer is being used.
const path = require("path")
const multer = require("multer")

// Creating a multer disk storage.
const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null, "uploads/")
    },
    filename: (req,file,cb)=>{
        // Generation a unique Name for the files 
        // Naming str :---  Date of uploading + A random number between 0 to 100
        let ext = path.extname(file.originalname)
        cb(null, Date.now() + Math.ceil(Math.random()*100) + ext )
    }
})


const upload = multer({
    storage,
    fileFilter:(req,file,cb)=>{
        if(file.mimetype= "application/pdf"){
            cb(null,true)
        }else{
            console.log("Only Pdf Supported")
            cb(null,false)
        }
    }
})

module.exports = upload
const path = require("path")
const multer = require("multer")

const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null, "uploads/")
    },
    filename: (req,file,cb)=>{
        let ext = path.extname(file.originalname)
        cb(null, Date.now + Math.ceil(Math.random()*100) + ext )
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
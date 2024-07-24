const express = require("express")
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();
const Admin = require('../models/Admin')
const Manager = require('../models/Manager')
const ReqAdmin = require('../models/ReqAdmin')
const {body, validationResult} = require('express-validator');
const dotenv = require('dotenv');
dotenv.config()


// Route 1: For approving a admin request
router.post('/approve', async (req,res)=>{
try {
        const {token,adminID} = req.body
          
        const tokenParsed = jwt.verify(token,process.env.JWT_SIGN)
        const id = tokenParsed.user.id
        
        const managerDetails = await Manager.findOne({_id: id})
        if(!managerDetails) return res.status(401).json({error: "Invalid Request"})
        if(managerDetails.managerID !== process.env.managerID)return res.status(401).json({error: "Invalid Request"})

        const adminDetails = await ReqAdmin.findOne({adminID: adminID})

        const admin = {
            name: adminDetails.name,
            email: adminDetails.email,
            adminID: adminDetails.adminID,
            password: adminDetails.password,
            code: adminDetails.code,
            date: adminDetails.date
        }

        // Creating a admin in admin collection
        const user = await Admin.create(admin)
        await ReqAdmin.deleteOne({adminID})

        const data = {
            user:{
                id: user.id
            }
        }
        const authToken = jwt.sign(data,process.env.JWT_SIGN)
        return res.json({authToken})
        
  } catch (error) {
        console.log(error)
        return res.status(404).send(`
            <!DOCTYPE html>
            <html lang="en">
              <head>
                <meta charset="utf-8">
                <title>Error</title>
              </head>
              <body>
                <pre>Cannot POST /api/manager/approve</pre>
              </body>
            </html>`)
 }
})

router.post("/login",[
  // validating the credentials
  body('password',"Password can't be blank").exists(),
  body('code', "Code can't be blank").exists()
],  async(req,res)=>{

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const {password,code} = req.body

    // if(!password) {return res.status(404).json({error: "Please Enter Password."})}
    // if(!code) return res.status(404).json({error: "Please Enter Code."})

    const managerDetails = await Manager.findOne({managerID: process.env.managerID})
    
    const passVerification = await bcrypt.compare(password,managerDetails.password)
    const codeVerification = await bcrypt.compare(code,managerDetails.code)

    if(!passVerification){
      return res.status(401).json({error: "Invalid Request"})
    }
    
    if(!codeVerification){
      return res.status(401).json({error: "Invalid Request"})
    }

    const data = {
      user:{
          id: managerDetails._id
      }
    }
    const authToken = jwt.sign(data,process.env.JWT_SIGN)
    res.status(200).json({authToken})

  } catch (error) {
    console.log(error)
    return res.status(500).json({error: "Some Internal error occured."})
  }
})

router.delete("/admin/delete", async(req,res)=>{
  try {
    const {token,adminID} = req.body
    
    const tokenParsed = jwt.verify(token,process.env.JWT_SIGN)
    const id = tokenParsed.user.id
    
    const managerDetails = await Manager.findOne({_id: id})
    if(!managerDetails) return res.status(401).json({error: "Invalid Request"})
    if(managerDetails.managerID !== process.env.managerID)return res.status(401).json({error: "Invalid Request"})

    console.log(adminID)
    if(!adminID) return res.status(401).json({error: "Invalid Request"})
    const deleteAdmin = await Admin.deleteOne({adminID})
    // if(!deleteAdmin) return res.status(401).json({error: "Invalid Request"})

    return res.status(200).json({success: "Successfully Deleted."})
  } catch (error) {
    console.log(error)
    return res.status(500).json({error: "Some Internal error occured."})
  }
})

module.exports = router
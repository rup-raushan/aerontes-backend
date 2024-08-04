const express = require("express")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const Admin = require('../models/Admin')
const ReqAdmin = require('../models/ReqAdmin')
const {body, validationResult} = require('express-validator');
const fetchadmin = require('../middleware/fetchadmin')
const dotenv = require('dotenv');
dotenv.config()



// Router 1: For Admin Id's request
// Login not required
router.post('/request',[
    // validating the credentials
    body('name', "Enter a valid Name.").isLength({min: 3}),
    body('email', "Enter a valid email.").isEmail(),
    body('password', "Password must me more than 8 characters.").isLength({ min: 7}),
    body("code", "Enter a valid code").isLength({min: 4,max: 8})

], async (req,res)=>{
    // Express validator error thower
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try{
        const {name, adminID, email,password,code} = req.body
        
        // Find if admin already exist or not :: In request Admin collection.
        let findUserEmail = await ReqAdmin.findOne({email: email})   
        let findUseradminID = await ReqAdmin.findOne({adminID: adminID})
        
        if(!!findUserEmail){
            return res.json({error: "User with this email already exist."})
        }else if(!!findUseradminID){
            return res.json({error: "User with this username already exist."})
        }
        
        // Find if admin already exist or not :: In Admin collection.
        findUserEmail = await Admin.findOne({email})
        findUseradminID = await Admin.findOne({adminID})
        
        if(!!findUserEmail){
            return res.json({error: "User with this email already exist."})
        }else if(!!findUseradminID){
            return res.json({error: "User with this username already exist."})
        }

        if(!(req.body.password === req.body.confirmPassword)){
            return res.json({error:"you have made some mistake."})
        }

        // Hasing Password
        // Genrating Salt
        const salt = await bcrypt.genSalt(10)
        const hasedPassword = await bcrypt.hash(password, salt)
        const hasedCode= await bcrypt.hash(code, salt)
        // Creating admin document
        let admin = await ReqAdmin.create({
            name: name,
            adminID: adminID,
            email: email,
            password: hasedPassword,
            code: hasedCode
        })

        // Collecting user _id for Token
        const data = {
            user:{
                id: admin._id
            }
        }
        // Creating Token
        const authToken = jwt.sign(data,process.env.JWT_SIGN)
        res.json({authToken})


    }catch (err){
        res.status(500).json({error: "Some Internal error occured."})
        console.log(err)
    }
})



// Route 2: For login 
// No login required
router.post("/login",[
    // validating the credentials
    body('password',"Password can't be blank").exists()
],
async (req,res)=>{
    // Express validator :---- error thrower
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
        const {adminID,password} = req.body;
        // Finding Admin in Database
        let user = await Admin.findOne({adminID})
        // Throwing error if credentials are wrong
        if(!user){
            return res.json({error: "Invalid username or password."})  
        }
        if(adminID != user.adminID){
            return res.json({error: "Invalid username or password."})
        }
        
        // Comparing the given password to the database
        const passwordCompare = await bcrypt.compare(password, user.password)
        if(!passwordCompare){
            return res.json({error: "Invalid username or password."})
        }

        // Creating token from user's _id
        const data = {
            user:{
                id: user._id
            }
        }
        const authToken = jwt.sign(data,process.env.JWT_SIGN)
        res.json({authToken})

    } catch (error) {
        console.log(error)
        res.status(500).json({error: "Some internal error occured."})
    }
})


// Router 3: For fetching all admins of Aeronotes
// No login required
router.post("/fetch", async (req, res)=>{
    try {
        const result = await Admin.find().select("-profile -password -code -date -_id")
        return res.json(result)
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Internal error occured"})
    }
})



// Route 4: for fetching all admin requests
// No Login Required
router.post('/fetch/request', async(req,res)=>{
    try{
        const totalRequest = await ReqAdmin.find();
        
        res.json(totalRequest)
    }catch(err){
        console.log(err);
        res.status(500).json({error: "Internal error occured"})
    }
})


// Route 5 : for fetching admin status is pending,approved or rejected
// Login required
router.post('/status', async(req,res)=>{
    try {
        const token = req.header('ADT')

        if(!token){
            return res.json({error: "Request first or Enter Admin id."})
        }

        // Verifing the token collecred form admin's local storage
        // Returns TRUE || FALSE
        const tokenData = jwt.verify(token, process.env.JWT_SIGN)

        if(!tokenData){
            return res.status(401).json({error: "Invalid token"})
        }

        // Checking whether admin already exist or requested
        const checkReqAdmin = await ReqAdmin.findOne({_id: tokenData.user.id})
        const checkAdmin = await Admin.findOne({_id: tokenData.user.id})

        // Returing message according to admin's condition
        if(!checkReqAdmin && checkAdmin){
            return res.json({id: checkAdmin.adminID , status: "Approved", message: 'Your request has been approved by the manager of Aeronotes.'})
        }

        if(checkReqAdmin){
            return res.json({id: checkReqAdmin.adminID , status: "Pending", message: 'Your request is pending.'})
        }

        if(!checkReqAdmin && !checkAdmin){
            return res.json({id: '',status: "Rejected", message: 'Your request has been rejected.'})
        }
        
    } catch (error) {
        console.log(error)
        return res.json({error: "Some Internal error occured."})
    }
})


// Route 6 : For fetching a admin's details.
// Login Required
router.post("/get", async(req,res)=>{
    try {
        const authToken = req.header("authToken")

        const adminTokenParsed = jwt.verify(authToken,process.env.JWT_SIGN)

        const _id = adminTokenParsed.user.id
        const adminDetails = await Admin.findOne({_id})

        if(!adminDetails){
            return res.json({error: "Not Possible"})
        }
        
        return res.status(200).json(adminDetails)
    } catch (error) {
        console.log(error)
        return res.status(500).json({error: "Some Internal error occured."})
    }
})

// Route 7: For fetching names of all admins
// No Login Required (normal user)
router.get('/get/names', async(req,res)=>{
    try{
        const adminNames = []
        // const authToken = req.query.token
        
        // if(!authToken)return res.status(401).json({error: "First Log in."})

        // const userDetailsParsed = jwt.verify(authToken,process.env.JWT_SIGN)

        // if(!userDetailsParsed) return res.status(404).json({error: "Account not found."})

        const allAdminDetails = await Admin.find().select("name -_id")

        allAdminDetails.map(e=>{
            adminNames.push(e.name)
        })
        return res.status(200).json({names: adminNames})
    }catch(error){
        console.log(error)
        return res.status(500).json({error:"Some Internal error occured."})
    }
})

// Route 8: Adding profile for admin
// Login required

router.post("/set_avatar",async(req,res)=>{
    try {
        const authToken = req.header("authToken")
        const {profile} = req.body

        const adminTokenParsed = jwt.verify(authToken,process.env.JWT_SIGN)
        
        const _id = adminTokenParsed.user.id
        const adminDetails = await Admin.findOne({_id})

        if(!adminDetails){
            return res.json({error: "Not Possible"})
        }
        
        const modifiedAdminDetails = await Admin.updateOne({_id},{$set:{profile:profile}})

        if(!modifiedAdminDetails){
            return res.json({error: "Not Possible"})
        }

        res.status(200).json({success: "Successfully added profile."})
    } catch (error) {
        console.log(error)
        return res.status(500).json({error: "Some Internal error occured."})
    }
})

router.get('/get_avatar', async(req,res)=>{
    try {
        const name = req.query.name

        const admin = await Admin.findOne({name})

        if(!admin) return res.status(400).json({error:"Invalid Details."})

        res.status(200).json({profile : admin.profile})   
    } catch (error) {
        console.log(error)
        return res.status(500).json({error: "Some Internal error occured."})
    }
})

module.exports = router
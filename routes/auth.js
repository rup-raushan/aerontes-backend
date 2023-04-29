const express = require("express")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser')
const router = express.Router();
const User = require('../models/User')
const {body, validationResult} = require('express-validator');
const dotenv = require('dotenv')
dotenv.config();
const JWT_SIGN = process.env.JWT_SIGN


// Route 1: For user's sing up
// No Login Required   
router.post("/createUser",[
    // validating the credentials
    body('name', "Enter a valid Name.").isLength({min: 3}),
    body('email', "Enter a valid email.").isEmail(),
    body('password', "Password must me more than 8 characters.").isLength({ min: 7}),
    body('confirmPassword', 'password cant be blank').exists()
],
async (req,res)=>{
    // Express validator error thrower
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    try {
        // for validation of user already exist or not
        let findUserEmail = await User.findOne({email: req.body.email})
        let findUserUsername = await User.findOne({username: req.body.username})

        // Returning ERROR if user exist
        if(findUserEmail){
            return res.json({error: "User with this email already exist."})
        }else if(findUserUsername){
            return res.json({error: "User with this username already exist."})
        }
        if(!(req.body.password === req.body.confirmPassword)){
            return res.json({error:"you have made some mistake."})
        }

        // Hashing  password and Generating Salt
        const salt = await bcrypt.genSalt(10)
        const hasedPassword = await bcrypt.hash(req.body.password, salt)

        // Crearing user in database
        let user = await User.create({
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            password: hasedPassword,
            rollno: req.body.rollno,
            gender: req.body.gender
        })

        // Creating token using _id of the user
        const data = {
            user:{
                id: user._id
            }
        }
        const authToken = jwt.sign(data,JWT_SIGN)

        res.json({authToken})

    } catch (error) {
        console.log(error)
        res.status(500).json({error: "Some internal error occured."})
    }
})



// Route 2: For login a user 
// No Login required
router.post("/login",[
    // validating the credentials
    body('password',"Password can't be blank").exists()
],
async (req,res)=>{
    // Express validator error thrower
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const {username,password} = req.body;

    try {
        // Finding user from the database
        let user = await User.findOne({username : username})
        
        if(!user){
            return res.json({error: "Invalid username or password."})  
        }
        if(username != user.username){
            return res.json({error: "Invalid username or password."})
        }
        
        // Comparing the given password with the password stored in the database
        const passwordCompare = await bcrypt.compare(password, user.password)
        if(!passwordCompare){
            return res.json({error: "Invalid username or password."})
        }
        
        // Creating token using the _id of the user
        const data = {
            user:{
                id: user._id
            }
        }
        const authToken = jwt.sign(data,JWT_SIGN)
        res.json({authToken})

    } catch (error) {
        console.log(error)
        res.status(500).json({error: "Some internal error occured."})
    }
})    


// Route 3: For getting user details
// Login required
router.post("/getUser", fetchuser ,async (req,res)=>{
    try {
        // Getting the users _id from middleware
        const userid = req.user.id
        const user = await User.findOne({_id: userid}).select("-password")
        res.json(user)
    } catch (error) {
        console.log(error)
        res.status(500).json({error: "Some internal error occured."})
    }

})

module.exports = router;
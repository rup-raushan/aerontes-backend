const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken")
const Notes = require("../models/Notes")
const Admin = require("../models/Admin")
const bcrypt = require('bcryptjs');
const {bucket} = require("../db")
const path = require('path')


// Route 1 : For uploading a note in uploads folder.
// Login required
router.post("/create", async (req,res)=>{
    try{
        const authToken = req.header("authToken")
        const {title,note, code ,description} = req.body;

        // verifing the token
        const adminTokenParsed = jwt.verify(authToken,process.env.JWT_SIGN)

        const _id = adminTokenParsed.user.id
        const adminDetails = await Admin.findOne({_id})

        if(!adminDetails){
          return res.json({error: "Not Possible"})
        }

        if(!code){
            return res.json({error: "Please enter code."})
        }
        
        const codeCompare = await bcrypt.compare(code,adminDetails.code)
        
        if(!codeCompare){
            return res.json({error: "Invalid Code."})
        }

        await Notes.create({
            title,
            subject: req.body.subject,
            note,
            by: adminDetails.name,
            description
        })

        return res.json({status: "success"})
    }catch(err){
        console.log(err)
        return res.json({error: "Some internal error occured."})
    }    
})


// Route 2 : for getting notes 
// Login Required

router.post("/getNotes", (req,res) => {
    try {
        const {notesName} = req.body;

        const file = bucket
        .find({
          filename: notesName
        })
        res.send(file)
    } catch (error) {
        console.log(error)
        res.status(500).json({error: "Some Internal error occured"})
    }
})


// Route 3 : for getting notes either all or by subjects
// No login required
router.get("/fetch", async (req,res)=>{
    try {
        const subject = req.query.subject

        if(!subject){
            return res.json({error: 'Please provide subject.'})
        }

        if(subject === "all"){
            const data = await Notes.find()
            return res.status(200).json(data)
        }
        
        const data = await Notes.find({subject: subject})
        if(!data){
            return res.json({error: 'Enter a valid subject.'})
        }
        
        return res.json(data)
    } catch (error) {
        console.log(error)
        return res.status(500).json({error: "Some Internal error occured."})
    }
})

// Route 4: for fetching a specific note
router.get('/get',(req,res)=>{
    const name = req.query.name

    res.sendFile(path.join(__dirname,`../${name}`))
})

module.exports = router;

// Route 5: For filteration of notes 
// Login not required

router.get('/filter',async(req,res)=>{
    try {
        const {admin,subject} = req.query

        if(!(admin || subject)) return res.status(400).json({error: "Please select criteria."})

        if(admin && !(subject)){
            const data = await Notes.find({by: admin})

            if(!data) return res.status(404).json({error: `Notes uploded by ${admin} not found.`})
            if(data.length == 0) return res.status(404).json({error: `${admin} has not uploaded any notes.`})

            return res.status(200).json(data)
        }

        if(subject && !(admin)){
            const data = await Notes.find({subject})

            if(data.length == 0 || !data) return res.status(404).json({error: `Notes of subject ${subject} not found.`})

            return res.status(200).json(data)
        }
        
        if(admin && subject){
            const data = await Notes.find({subject,by: admin})

            if(data.length == 0 || !data) return res.status(404).json({error: `Notes not found.`})

            return res.status(200).json(data)
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({error:"Some Internal error occured."})
    }
})

// Route 6: For deleting a notes
// No Login required

router.delete('/delete',async (req,res)=>{
    try {
        const {_id} = req.headers

        if(!_id){
            return res.status(401).json({error: "Please Enter the notes Id."})
        }

        const notesById = await Notes.findOne({_id})

        if(!notesById){
            return res.status(404).json({error: "Notes not found"})
        }

        const deleteNotes = await Notes.deleteOne({_id})

        if(!deleteNotes){
            return res.status(401).json({error: "Notes can't able to Delete."})
        }

        return res.status(200).json({status: true,msg: "Successfully deleted."})
    } catch (error) {
        console.log(error)
        return res.status(500).json({error: "Some Internal error occured."})
    }
})
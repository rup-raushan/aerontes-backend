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
        const { adminID, code } = req.body;
        // Finding a admin for approvement
        const adminDetails = await ReqAdmin.findOne({adminID: adminID})
        const manager = await Manager.findOne({managerID: process.env.managerID})
        // verifing manager code
        const codeValidation = await bcrypt.compare(code, manager.code)


        if(!codeValidation){
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

        if(!adminDetails){
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

module.exports = router
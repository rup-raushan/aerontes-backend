const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')
dotenv.config();

const JWT_SIGN = process.env.JWT_SIGN;

// Middleware for setting accessing the _id of the uesr
const fetchuser = (req,res,next)=>{
    const token = req.header('auth-token')
    if(!token){
        res.status(401).json({error: 'Access denied'})
    }
    try{
        const data = jwt.verify(token,JWT_SIGN)
        req.user = data.user
        next()
    }catch{
        res.status(401).json({error: 'Access denied'})
    }
}
module.exports = fetchuser;
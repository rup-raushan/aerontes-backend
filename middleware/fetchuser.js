// Setting up a middleware for getting admin info
// admin's data will be in req.user

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')
dotenv.config();

const JWT_SIGN = process.env.JWT_SIGN;

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
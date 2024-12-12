const jwt  = require("jsonwebtoken")


const generateToken = (ID,email)=>{
    return jwt.sign(
        {
        id:ID,
        email:email,
        },
        process.env.SECRET_KEY,
        {
            expiresIn:"30d"
        }
    )
}

module.exports =  generateToken
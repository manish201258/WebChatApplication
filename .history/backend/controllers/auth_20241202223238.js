const User = require("../models/userModel.js");
const bcrypt = require("bcryptjs")
const generateToken = require("./generateToken.js")
require('dotenv').config();

// Register
const register= async(req,res)=>{
    try {
        const {username,email, password} = req.body;   

        const userNameExist  = await User.findOne({username});
        const userExist  = await User.findOne({email});
        const hash_pass = await bcrypt.hash(password,10);
    
        if(userExist || userNameExist){
            return res.status(403).json({message:"Credentials alreday exist"});
        }
    
        const UserCreate = await User.create({
            username,
            email,
            password:hash_pass
        })

          
        res.status(201).json({
            message:"User Registered",
            token:generateToken(UserCreate._id,UserCreate.email)
        })
    } 
    catch (error) {
        console.log("Server side Register User error")
    }    
}

// Login
const login = async(req,res)=>{
    
    const {email,password} = req.body;

    const userExist = await User.findOne({email});
    if(!userExist){
        return res.status(403).json({message:"Invalid Credentials"})
    }

    const checkPass = await bcrypt.compare(password,userExist.password);

    if(!checkPass){
        return res.status(403).json({message:"Invalid Credentials"})
    }


    res.status(201).json({
        message:"User LoggedIn",
        token:generateToken(userExist._id,userExist.email)
    })
}


// User Data

const userData = async(req,res)=>{

    try {
        if(!req.user.email){
            return res.status(401).json({
                msg:"Data not found"
            })
        }

        const email = req.user.email;
        const userdata = await User.findOne({email}).select({password:0})
        return res.status(201).json({
            data:userdata
        });

    } catch (error) {
        console.log("error in user data fetch")
    }

}

module.exports =  {register,login,userData};
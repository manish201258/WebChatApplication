const User = require("../models/userModel.js");
const bcrypt = require("bcryptjs");
const generateToken = require("./generateToken.js");

require('dotenv').config();

// Register
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // Validate the request body
        if (!username || !email || !password) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        const userNameExist = await User.findOne({ username });
        const userExist = await User.findOne({ email });

        if (userExist || userNameExist) {
            return res.status(403).json({ message: "Credentials already exist" });
        }

        const hash_pass = await bcrypt.hash(password, 10);


const uniqueId = shortid.generate();
console.log(uniqueId); // Example output: 'K7Ck5nKQs'

        const userCreate = await User.create({
            username,
            email,
            password: hash_pass
        });

        res.status(201).json({
            message: "User Registered",
            token: generateToken(userCreate._id, userCreate.email)
        });
    } catch (error) {
        console.error("Error in user registration:", error);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
};

// Login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Please provide both email and password" });
        }

        const userExist = await User.findOne({ email });
        if (!userExist) {
            return res.status(403).json({ message: "Invalid Credentials" });
        }

        const checkPass = bcrypt.compare(password, userExist.password);

        if (!checkPass) {
            return res.status(403).json({ message: "Invalid Credentials" });
        }

        res.status(201).json({
            message: "User Logged In",
            token: generateToken(userExist._id, userExist.email)
        });
    } catch (error) {
        console.error("Error in user login:", error);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
};

// User Data
const userData = async (req, res) => {
    try {
        if (!req.user || !req.user.email) {
            return res.status(401).json({ msg: "Not authorized" });
        }

        const email = req.user.email;
        const userdata = await User.findOne({ email }).select({ password: 0 });

        if (!userdata) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            data: userdata
        });
    } catch (error) {
        console.error("Error in user data fetch:", error);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
};

module.exports = { register, login, userData };

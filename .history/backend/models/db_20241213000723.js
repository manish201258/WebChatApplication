const mongoose  = require("mongoose");


const URI = process.env.DB
const DBConnect  = async()=>{

    try {
       await mongoose.connect(process.env.DB_URL);
       console.log("Connection Success") 
    } catch (error) {
        console.log("Connection Failed");
    }

}
module.exports = DBConnect;

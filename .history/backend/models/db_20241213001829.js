const mongoose  = require("mongoose");



const DBConnect  = async()=>{
    try {
       await mongoose.connect(process.env.DB_UR);
       console.log("Connection Success") 
    } catch (error) {
        console.log("Connection Failed");
    }

}
module.exports = DBConnect;

const mongoose  = require("mongoose");
const URI = "mongodb://localhost:27017/ChatApp";


const DBConnect  = async()=>{

    try {
       await mongoose.connect(URI);
       console.log("Connection Success") 
    } catch (error) {
        console.log("Connection Failed");
    }

}
module.exports = DBConnect;

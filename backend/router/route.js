const express = require("express")
const router = express.Router()
const {register , login,userData} =  require("../controllers/auth");
const authentication = require("../middleware/tokenVerify")
const {sendMessage,getMessage} = require("../controllers/messageController")
const {sidebarUserData,sideUserDataAdd} = require("../controllers/DataController.js");
const { blockChatPerson,unblockChatPerson,blockedUserData, deleteConversation } = require("../controllers/userManage.js");
// Authentication route
router.post("/register",register);
router.post("/login",login);
router.get("/data",authentication,userData);

// message route

router.post("/send/:id",authentication,sendMessage)
router.get("/get/:id",authentication,getMessage)

// User Data

router.get("/sideuser",authentication,sidebarUserData)
router.post("/sideuseradd/:username",authentication,sideUserDataAdd)

// User Manage
router.post("/blockuser/:id",authentication,blockChatPerson)
router.post("/unblockuser/:id",authentication,unblockChatPerson)
router.get("/blockeddata",authentication,blockedUserData)
router.post("/deleteconversation/:id",authentication,deleteConversation)


module.exports = router
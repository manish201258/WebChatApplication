const User = require("../models/userModel.js")
const Conversation = require('../models/conversationModel.js')

const sidebarUserData = async (req, res) => {
    try {
        const loggedUserId = req.user.id;

        const conversations = await Conversation.find({ participants: loggedUserId })
            .populate("participants", "-password")
            .select("participants -_id");

        const users = conversations
            .flatMap(conversation => conversation.participants)
            .filter(user => user._id.toString() !== loggedUserId);

        return res.status(200).json(users);
    } catch (error) {
        console.error("Error in sidebarUserData:", error);
        res.status(500).json({
            msg: "Server side error",
        });
    }
};

   


const sideUserDataAdd = async (req, res) => {
    try {
        const loggedUserId = req.user?.id; // Validate `req.user`
        const usernaToAdd = req.params.username;

        if (!loggedUserId) {
            return res.status(401).json({ msg: "Unauthorized request" });
        }

        // Fetch the logged-in user
        const loggedUser = await User.findById(loggedUserId);
        if (!loggedUser) {
            return res.status(404).json({ msg: "Logged-in user not found" });
        }

        // Fetch the user to add by username
        const userToAdd = await User.findOne({ username: usernameToAdd }).select({ password: 0 });
        if (!userToAdd) {
            return res.status(404).json({ msg: "User to add not found" });
        }

        // Prevent adding yourself
        if (userToAdd._id.toString() === loggedUserId) {
            return res.status(403).json({ msg: "Cannot add yourself" });
        }

        // Check if a conversation already exists between the two users
        const existingConversation = await Conversation.findOne({
            participants: { $all: [loggedUserId, userToAdd._id] },
        });

        if (existingConversation) {
            return res.status(400).json({ msg: "Conversation already exists", conversation: existingConversation });
        }

        // Create a new conversation
        const newConversation = new Conversation({
            participants: [loggedUserId, userToAdd._id],
            messages: [],
        });

        await newConversation.save();

        return res.status(201).json({
            msg: "Conversation created successfully",
            conversation: newConversation,
        });
    } catch (error) {
        console.error("Error in sideUserDataAdd:", error.message);
        res.status(500).json({ msg: "Server-side error", error: error.message });
    }
};




module.exports = {sidebarUserData,sideUserDataAdd}
const User = require("../models/userModel.js");
const Conversation = require("../models/conversationModel.js");

// Get Sidebar User Data
const sidebarUserData = async (req, res) => {
  try {
    const loggedUserId = req.user.id;

    const conversations = await Conversation.find({ participants: loggedUserId })
      .populate("participants", "-password")
      .select("participants -_id");


    const users = conversations
      .flatMap((conversation) => conversation.participants)
      .filter((user) => user._id.toString() !== loggedUserId)
      .reduce((uniqueUsers, user) => {
        if (!uniqueUsers.some((u) => u._id.toString() === user._id.toString())) {
          uniqueUsers.push(user);
        }
        return uniqueUsers;
      }, []);

    return res.status(200).json(users);
  } catch (error) {
    console.error("Error in sidebarUserData:", error);
    res.status(500).json({
      msg: "Server-side error",
    });
  }
};

// Add a New User to Sidebar
const sideUserDataAdd = async (req, res) => {
  try {
    const loggedUserId = req.user?.id;
    const userUIDToAdd = req.params.uid;
    console.log(userUIDToAdd)
    if (!loggedUserId) {
      return res.status(401).json({ msg: "Unauthorized request" });
    }

    const loggedUser = await User.findById(loggedUserId);
    if (!loggedUser) {
      return res.status(404).json({ msg: "Logged-in user not found" });
    }

    const userToAdd = await User.findOne({ uid: userUIDToAdd }).select("-password");
    console.log(userToAdd)
    if (!userToAdd) {
      return res.status(404).json({ msg: "User to add not found" });
    }

    const existingConversation = await Conversation.findOne({
      participants: { $all: [loggedUserId, userToAdd._id] },
    });

    if (existingConversation) {
      return res.status(400).json({ msg: "Conversation already exists" });
    }

    const newConversation = new Conversation({
      participants: [loggedUserId, userToAdd._id],
    });

    await newConversation.save();

    res.status(201).json({
      msg: "User added successfully to the sidebar",
      conversation: newConversation,
    });
  } catch (error) {
    console.error("Error in sideUserDataAdd:", error);
    res.status(500).json({ msg: "Server-side error" });
  }
};

module.exports = {
  sidebarUserData,
  sideUserDataAdd,
};

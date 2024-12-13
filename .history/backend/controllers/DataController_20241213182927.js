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

    if (!loggedUserId) {
      return res.status(401).json({ msg: "Unauthorized request" });
    }

    // Validate the logged-in user
    const loggedUser = await User.findById(loggedUserId);
    if (!loggedUser) {
      return res.status(404).json({ msg: "Logged-in user not found" });
    }

    // Validate the user to add
    const userToAdd = await User.findOne({ uid: userUIDToAdd }).select("-password");
    if (!userToAdd) {
      return res.status(404).json({ msg: "User to add not found" });
    }

    // Check if the conversation already exists
    const existingConversation = await Conversation.findOne({
      participants: [loggedUserId, userToAdd._id],
    });

    if (existingConversation) {
      return res.status(400).json({ msg: "User already added to sidebar" });
    }

    // Create a new conversation for one-sided visibility
    const newConversation = new Conversation({
      participants: [loggedUserId], // Only add the logged-in user for now
      addedUser: userToAdd._id, // Keep track of who was added
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

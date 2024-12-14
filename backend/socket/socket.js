const { Server } = require("socket.io");
const express = require("express");
const http = require("http");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000","https://webchatapplication-6il8.onrender.com", "http://localhost:5173"],
    methods: ["GET", "POST"],
  },
});

const getReceiverSocketId =(reciverId)=>{
    return userSocketMap[reciverId];
}

const userSocketMap = {}; 

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);
  const userId = socket.handshake.query.userId;

  if (userId && userId !== "undefined") {
    userSocketMap[userId] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);

    for (const [key, value] of Object.entries(userSocketMap)) {
      if (value === socket.id) {
        delete userSocketMap[key];
        break;
      }
    }

    // Emit updated online users
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

module.exports = { app, io, server,getReceiverSocketId };

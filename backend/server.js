const express = require("express")
const cors = require('cors');
const DBConnect = require("./models/db.js");
const router = require("./router/route.js");
const { app, server } = require('./socket/socket.js');



const corsOptions = {
    origin: [
      "http://localhost:3000",
      "https://webchatapplication-6il8.onrender.com",
      "http://localhost:5173",
      "https://chatterrbox.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Allows cookies or authentication headers
  };
  
  app.use(cors(corsOptions));

  

app.use(express.json());
app.use("/auth/api", router);


DBConnect().then(() => {
    const port = process.env.PORT || 3000;
    server.listen(port, () => {
        console.log(`Server Running on port ${port}`);
    });
    
}).catch((error) => {
    console.error("Failed to connect to database", error);
});
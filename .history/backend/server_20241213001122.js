const express = require("express")
const cors = require('cors');
const DBConnect = require("./models/db.js");
const router = require("./router/route.js");
const { app, server } = require('./socket/socket.js');

app.use(cors())

app.use(express.json());
app.use("/auth/api", router);


DBConnect().then(() => {
    const port = 000;
    server.listen(port, () => {
        console.log(`Server Running on port ${port}`);
    });
}).catch((error) => {
    console.error("Failed to connect to database", error);
});
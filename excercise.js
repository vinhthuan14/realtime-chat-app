const express = require("express");
const { createServer } = require("http");
const { emit } = require("process");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views","./views")

io.on("connection", function (socket) {
    console.log("user --" + socket.id + "-- conected");
    socket.on("disconnect", function () {
        console.log("user --" + socket.id + "-- disconnect");
    })
    socket.on("Client-sent-connect", function (data) {
        console.log("user --" + socket.id + "-- sent: " + data);
        io.sockets.emit("Server-respon", socket.id + " connected")
    })
    socket.on("Client-submit", function (data) {
        io.sockets.emit("Server-respon","user --" + socket.id + "-- sent: " + data )
    })
})

app.get("/", function (req,res) {
    res.render("practice1")
})

httpServer.listen(3001);

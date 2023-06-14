// var express = require("express");

// var app = express();

// app.use(express.static("public"));
// app.set("view engine", "ejs");
// app.set("views", "./views");

// var server = require("http").Server(app);
// const io = require("socket.io")(server);
//server.listen(3000);
const express = require("express");
const { createServer } = require("http");
const {Server} = require("socket.io")

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");

io.on("connection", function (socket) {
  console.log("user "+socket.id +" connected")
  socket.on("disconnect", function () {
    console.log("user "+socket.id +" disconnected")
  })
  socket.on("Client-sent-data", function (data) {
    console.log("Client--"+socket.id+"--sent : " + data)
    io.sockets.emit("Server-sent-data", "Sever listened --"+socket.id)
  })
});

app.get("/", function (req, res) {
   res.render("trangchu");
})

httpServer.listen(3000);
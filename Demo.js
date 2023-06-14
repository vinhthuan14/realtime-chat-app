const express = require("express");
const { createServer } = require("http");
const { emit } = require("process");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views")

var user = []
var rooms = []
io.on("connection", function (socket) {
    socket.on("isLogin", function (data) {
        if (user.findIndex(function (item) {return item.name === data}) >= 0) {
            socket.emit("Alert", "Tài khoản đã tồn tại")
        }
        else if (!data | data.trim().length ==0) {
            socket.emit("Alert","Vui lòng nhập UserName")
        }
        else {
            socket.emit("Successful",data)
            // socket.emit("Alert","Đăng nhập thành công")
            var p = [...user, {name: data, type: "user"}];
            user = p;
            io.sockets.emit("UsersList", user)
            socket.Username = data;
            console.log(user);
        }
    })
    socket.on("disconnect", function () {
        user.splice(user.indexOf(socket.Username), 1)
        io.sockets.emit("UsersList", user)
        console.log(user);
    })
    socket.on("sendMessage", function (data) {
        // console.log("user")
        socket.broadcast.emit("User-send-text", {un:socket.Username , txt:data})
    })
    socket.on("sendMessage_Sender", function (data) {
        // console.log("sender")
        socket.emit("Sender-send-text", {un:socket.Username , txt:data})
    })
    socket.on("SenderWriting", function (data) {
        socket.broadcast.emit("Sender-writing-text", {un:socket.Username , isWriting:data})
    })
    socket.on("create-rooms", function (data) {
        socket.join(data)
        console.log(socket.adapter.rooms)
        socket.Room = data;
        if (user.findIndex(function (item) {
            return item.name === data;
        }) < 0) {
            user.push({name: data, type:"room"});
        }
        console.log(user)
        io.sockets.emit("UsersList", user)
    })
})
app.get("/", function (req, res) {
    console.log("Server Connected")
    res.render("app_chat")
})

httpServer.listen(3000)
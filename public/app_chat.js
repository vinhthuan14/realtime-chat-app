var socket = io("http://localhost:3000/")
socket.on("Alert", function (data) {
     alert(data)
})
socket.on("Successful", function (data) {
    $("#login").val('Please Wait...');
    $("#login").attr("disabled", true);
    setTimeout(() => {
        $("#loginForm").hide();
    }, 1000);
    setTimeout(() => {
        $("#chatForm").show();
    }, 1000);
    $("#userName").append(data);
})
socket.on("UsersList", function (data) {
    $("#onlineList").empty();
    data.forEach(item=> {
        if (item.type === "user") {
            $("#onlineList").append("<li id='onlineList_item'>"+item.name+"</li>");
        }
        else if (item.type === "room") {
             $("#onlineList").append("<li id='onlineList_item'>"+"Group: "+item.name+"</li>");
        }
    });
})
socket.on("User-send-text", function (obj) {
        $("#mes_top").append('<div class="userTxt" style="align-items: flex-start;"><div class="userTxt_name">' + obj.un + '</div><div class= "userTxt_text" style="background-color:#ffc0cb" >' + obj.txt + "</div></div>")
    const element = document.getElementById("mes_top");
    let present_height = element.scrollHeight;
    $("#mes_top").scrollTop(present_height)
})
socket.on("Sender-send-text", function (obj) {
        $("#mes_top").append('<div class="userTxt" style="align-items: end; " ><div class="userTxt_name">' + obj.un + '</div><div class= "userTxt_text" style="background-color:#93d6ff"  >' + obj.txt + "</div></div>")
    const element = document.getElementById("mes_top");
    let present_height = element.scrollHeight;
    $("#mes_top").scrollTop(present_height)
})
socket.on("Sender-writing-text",function (obj) {
    if (obj.isWriting) {
        // $("#mes_top").append('<div class="userTxt_writing" style="align-items: flex-start;"><div class="userTxt_name">' + obj.un + '</div><div class= "userTxt_text" style="background-color:#ffc0cb" >' + '<i>Đang soạn tin...</i>' + "</div></div>")
        $("#mes_top").append('<div class="userTxt_writing" style="align-items: flex-start;"><div class="userTxt_name">' + obj.un + '</div><div class= "userTxt_text" style="background-color:#ffc0cb" >' + '<div class="dot-elastic"></div>' + "</div></div>")
        //move to present height
        const element = document.getElementById("mes_top");
        let present_height = element.scrollHeight;
        $("#mes_top").scrollTop(present_height)
    } else {
        $(".userTxt_writing").remove();
    }
})
$(document).ready(function () {
    $("#chatForm").hide();
    $("#closeForm").click(function (e) {
        e.preventDefault();
        $("#createGroupForm").css("display", "none");
    })
    $("#login").click(function (e) {
        e.preventDefault();
        socket.emit("isLogin",$("#loginUser").val())
        $("#loginUser").val("")
    });
    $("#inpSendMessages").focusin(function () {
        socket.emit("SenderWriting", true)
        // console.log("focus in")
    })
    $("#inpSendMessages").focusout(function () {
        socket.emit("SenderWriting", false)
        console.log("focus out")
    })
    $("#btnSendMessage").click(function (e) {
        e.preventDefault();
        if ($("#inpSendMessages").val() | $("#inpSendMessages").val().trim().length != 0) {
            socket.emit("sendMessage", $("#inpSendMessages").val())
            socket.emit("sendMessage_Sender", $("#inpSendMessages").val())
            $("#inpSendMessages").val("")
            // console.log($("#inpSendMessages").val())
        }
    });

    $("#btnLogOut").click(function () {
        // socket.emit("userLogout");
        location.reload(true);
    });
    $("#btnCreateGroup").click(function (e) {
        e.preventDefault();
        // $("#chatForm").hide();
        $("#createGroupForm").css("display", "block");

    })
    $("#createGroupForm_button").click(function (e) {
        e.preventDefault();
        socket.emit("create-rooms", $("#createGroupForm_input").val())
        console.log($("#createGroupForm_input").val())
        $("#createGroupForm_input").val("")
        $("#createGroupForm").css("display", "none");
    })
    $("#onlineList").click(function (e) {
        e.preventDefault();
        alert(this.text());
    });

})
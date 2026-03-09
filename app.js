const express =require('express')
const app=express();
const path=require("path");
const http=require("http");
const server=http.createServer(app);
const socketio=require('socket.io');

const io=socketio(server);

app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));
const users={};
io.on("connection",function(socket){
    console.log("User connected",socket.id);
    users[socket.id]={
        id:socket.id
    };

    io.emit("active-users",Object.values(users));
    
    socket.on("send-location",function(data){
        io.emit("receive-location",{id:socket.id,...data});
    });
    socket.on("disconnect",function(){
        io.emit("user-disconnected",socket.id);
        io.emit("active-users",Object.values(users));
    })
    console.log("connected");
});

app.get("/",function(req,res){
    res.render("index");
})

server.listen(3000,"0.0.0.0");
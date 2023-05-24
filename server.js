const express = require('express');
const app = express();
const server = require('http').Server(app)
const io = require('socket.io')(server,{cors: {
  origin: '*',
  maxHttpBufferSize: 1e9,
}
})
var bodyParser = require('body-parser')
var db= require('./db')


var path    = require("path");

const cors = require("cors");
const json = require('body-parser/lib/types/json');
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

var usersRoom=new Map();
var userAllowed=3

app.get("/getUsersRoomAll",(req,res)=>{

  res.send(

    Array.from(usersRoom)
  );

  console.log("total length.........",Array.from(usersRoom).length)


})
app.post("/getUsersRoom",(req,res)=>{

var ar=Array.from(usersRoom).filter(([_key, value]) => {
  return value.status==true && value.userCount>0 && value.userCount<=userAllowed;
})
if(ar.length==0){
  res.send('0'); 
}else{
res.send(ar);  
}
})


io.on('connection', socket => {

var roomId;

socket.on("createRoom",(userData1)=>{
  var userData=JSON.parse(userData1);
 
  if(!usersRoom.get(userData.roomId)){

  var rand = Math.floor(Math.random() * 10000) + 1;
  roomId=rand
  var users=[];

var usersdata={
  "soketData":{
    "userName":userData.userName,
    "socketId":socket.id,  

}
};

 users.push(usersdata);


 var roomData={
  'status':true,
  'userCount':1,
  'roomId':roomId,
  'users':users

 }
  socket.join(roomId);

  usersRoom.set(roomId,roomData)
  io.to(socket.id).emit("roomCreated",roomId)
  
  //console.log("room creator joined to "+ JSON.stringify(Array.from(socket.rooms)))
  }else{

    io.to(socket.id).emit("checkInRoomJoined",true)

  }
})


socket.on("sendMsg",(msgObj)=>{
  console.log("msgObj,....",msgObj)
var roomSend=Array.from(socket.rooms).filter((el)=>el!=socket.id);

roomSend.forEach((sendtoroomid)=>{

  console.log("sendMsg,....",sendtoroomid)
  // io.to(sendtoroomid).emit("reciveMsg",msgObj)


  socket.to(sendtoroomid)
      .emit('reciveMsg', msgObj);

})
    

})

socket.on("setTyping",(setTyping)=>{
  // console.log("typing,....",setTyping)
var roomSend=Array.from(socket.rooms).filter((el)=>el!=socket.id);

roomSend.forEach((sendtoroomid)=>{

  // console.log("sendMsg,....",sendtoroomid)
  // io.to(sendtoroomid).emit("reciveMsg",msgObj)


  socket.to(sendtoroomid)
      .emit('getTyping', setTyping);

})
    

})





socket.on('joinRoom',(joinObj1)=>{
  var joinObj=JSON.parse(joinObj1);
  var joinTo=JSON.parse(joinObj.joinTo);
  var mySocket=Array.from(socket.rooms).filter((el)=>el=socket.id);
  console.log("myscoket.............",joinObj)
if(Array.from(socket.rooms).length<2){

  
  
  var userName=joinObj.userName;
  min = Math.ceil(0);
  max = Math.floor(joinTo.length-1);
  var index= Math.floor(Math.random() * (max - min + 1)) + min;
  

var joinRoomId=joinTo[index][0]

var getUsersRoom=usersRoom.get(joinRoomId);

if(getUsersRoom && getUsersRoom.status==true && getUsersRoom.userCount<=userAllowed){


  var usersdata={
    "soketData":{
      "userName":userName,
      "socketId":socket.id,
  
  }
  };
  getUsersRoom.users.push(usersdata)
if(getUsersRoom.userCount<=userAllowed && getUsersRoom.status==true){
  // getUsersRoom.joiner=joinTo[index][1].joiner
  getUsersRoom.userCount=getUsersRoom.userCount+1;
  if(getUsersRoom.userCount===userAllowed){
    getUsersRoom.status=false;
   
  }

  usersRoom.set(joinRoomId,getUsersRoom)
  roomId=joinRoomId;
  socket.join(joinRoomId)

  //JSON.stringify(Array.from(socket.rooms))
  console.log("usersRoom.get(joinRoomId)..............",usersRoom.get(joinRoomId))
  io.to(roomId).emit('userJoined', JSON.stringify(usersRoom.get(joinRoomId)));

 
}else{

  io.to(socket.id).emit("retryUserJoined",true);

}
  
}
}


})

socket.on("leaveRoom",(leaveRoom)=>{
  socket.leave(roomId);
  usersRoom.delete(roomId);
})

socket.on("skipUser",(skipUser)=>{

  skipAndDisconnect();
})


function skipAndDisconnect(){
  
    // leaveRoomId=Array.from(socket.rooms)[1];
   
    usersRoomUpdate=usersRoom.get(roomId)
    
    if(usersRoom.get(roomId)){
      if(usersRoomUpdate.status==true && usersRoomUpdate.userCount==1){
        socket.leave(roomId)
        usersRoom.delete(roomId);
      }
    }

    if(usersRoom.get(roomId)){
      if(usersRoomUpdate.userCount<=userAllowed){
        
        socket.leave(roomId)
    
        var disconnectedUser=usersRoomUpdate.users.filter((el)=>el.soketData.socketId==socket.id)
       
        var deleteUser=usersRoomUpdate.users.filter((el)=>el.soketData.socketId!=socket.id);
 
console.log("disconnected user.....",disconnectedUser)
        // usersRoomUpdate.users.splice(deleteUser,1)
        usersRoomUpdate.users=deleteUser;
        usersRoomUpdate.userCount=usersRoomUpdate.userCount-1;
        usersRoomUpdate.status=true;

        usersRoom.set(roomId,usersRoomUpdate);
        
        
        io.to(roomId).emit('userDisconnected',JSON.stringify(disconnectedUser))
        // socket.leave(roomId)
        // usersRoom.delete(roomId);
      }
    }

}


socket.on("disconnect",()=>{

  skipAndDisconnect();

     //console.log(usersRoom)
  //usersRoom.delete(leaveRoomId)

  })








})






server.listen(3000, () => {
  console.log('listening on *:3000');
});
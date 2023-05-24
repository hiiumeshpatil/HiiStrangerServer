   
    Connector=$(document).ready(function(){
      var userName;
      var roomId;
      var roomMembers;
      var socket = io('http://localhost:3000', { transports : ['websocket'] });
      
       init()

    function init(){
      socket.on('connect', () => {
    
  //dmmy code for test only
        var name = Math.floor(Math.random() * 1000) + 1;
          var name2="umesh"+name;
          $("#username").val(name2)
          userName=$("#username").val();
          console.log("username.......",userName)
          getUsersRoom()
  
  
  //dummy code for test only
  
    userJoined();
    retryUserJoined();
    userDisconnected();
    roomCreated();
    checkInRoomJoined();
   console.log("socket connected........"+socket.id);
  
  })
  
    }

    $("#search").click(function(){
      var name = Math.floor(Math.random() * 1000) + 1;
      var name2="umesh"+name;
      $("#username").val(name2)
      userName=$("#username").val();
      console.log("username.......",userName)
      getUsersRoom()
    

    });

   
    $("#skip").click(function(){
       
      userName=$("#username").val();
      console.log("username.................",userName)
      userSkip();
      setTimeout(getUsersRoom(),2000)
      
    

    });


function userDisconnected(){
  socket.on('userDisconnected',(disconnectdUser)=>{
console.log("user disconnected .........",disconnectdUser[0].soketData.socketId)
console.log("user disconnected .........",disconnectdUser[0].soketData.userName)
console.log("anoter will join for someone else t join .......")
roomMembers=roomMembers-1;
      console.log("current room members are ....",roomMembers)
 
  })
}


function getUsersRoom() {
console.log("finding users to join in getUsersRoom method")
  new Promise((resolve, reject) => {
   resolve(
    $.get("http://localhost:3000/getUsersRoom", function(data, status){
         

             })

   );

}).then(result =>{
 console.log(result)
    if(result.length!=0){
      console.log(" available")
// logic for conection ;
console.log("room  found i am joining room",result[0][1])

joinRoom(result,userName);

$("#search").hide();

    }else{
      console.log("room not found i am creating room........")
      var createRoomObj={
        'roomId':roomId,
        'userName':userName
      }
      createRoom(createRoomObj);
      
      

    }
   
}).catch(err =>{
   console.error(err)
})

}


 function createRoom(userName){
  
     socket.emit("createRoom",userName);
     console.log("new room created waiting for other to join my room .......", roomId)
     $("#search").hide();
   
 }

 function joinRoom(joinTo,userName){

  var joinObj={
    'joinTo':joinTo,
    'userName':userName,
    'roomId':roomId

  }
  // joinTo[0][1].joiner=userName
  socket.emit("joinRoom",(joinObj))
 }

 function userJoined(){
  socket.on('userJoined',(joinedUser)=>{
console.log("user joind in room........")
$("#search").hide();
   roomId=joinedUser.roomId;
   roomMembers=joinedUser.userCount;
    joinedUser.users.forEach((element)=>{

    if(element.soketData.socketId!=socket.id){
      console.log(element.soketData.userName+"....joined in room")
 
      console.log("room........",roomId)
    }
    })
 
  })
 }


function retryUserJoined(){

  socket.on('retryUserJoined',(retryUserJoined)=>{
    console.log("retryUserJoined.........",retryUserJoined)
if(retryUserJoined==true){

  getUsersRoom();

}
   
  })
}

function userSkip(){

  socket.emit("skipUser",(userSkip));
  console.log("skipping user..................")

}

function roomCreated(){
  socket.on("roomCreated",roomCreated=>{
    roomId=roomCreated;

    console.log("room created wait for another ",roomId)
  });
}

function checkInRoomJoined(){
  socket.on("checkInRoomJoined",(checkInRoomJoined)=>{
if(checkInRoomJoined==true){

  console.log("you are already in room ",roomId)
}
  })
}





 
});
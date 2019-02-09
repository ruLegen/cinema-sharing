
import SocketIO from 'socket.io'
const socket = SocketIO(3001)
const rooms = socket.sockets.adapter.rooms  
let states = {}
let userCount = 0;
socket.on("connection",(client)=>{
    var currentRoomName;  //Using for tracking disconected users, and notify everyone in this room
    console.log("New connection",client.id)

    client.on("disconnect",()=>{
        try {
            states[currentRoomName] = Object.assign({},states[currentRoomName],{
                users: getUsersName(currentRoomName,socket),
                roomName: currentRoomName
            })
            socket.to(currentRoomName).emit("USER_DISCONNECTED", states[currentRoomName])

        }
        catch (e) {

        }
    })
    client.on("JOIN_ROOM",(room)=>{
        console.log("JOIN_ROOM by",client.id)
            userCount+=1;
            client.leaveAll();
            client.join(room)
            client.join(client.id)  //by default user joined to room by his ID, need for send individual messages
            client.nickname = "User"+ userCount;
            currentRoomName = room
           
            states[room] = Object.assign({},states[room],{users:getUsersName(room,socket),roomName:room})
            client.emit("ROOM_JOINED",states[room])
            socket.to(room).emit("USER_CONNECTED",states[room])
            socket.to(client.id).emit("UPDATE_FROM_SERVER",{type:"INIT_STORE",state:states[room]})


     
    })

    client.on("CREATE_ROOM",(room)=>{
        console.log("CREATE_ROOM by",client.id)
        console.log("CREATED by ",client.id)
            client.leaveAll();
            client.join(client.id) // made for restore first room which is same as client.id
            client.join(room)
            client.emit("ROOM_CREATED",room)
    })
    client.on("USER_ACTION",(action)=>{
       //FIX bugs from bad object assign
       try
       {
           console.log(action, "BEFORE",states[currentRoomName].currentVideo)
           switch (action.type) {
               case "CURRENT_VIDEO_CHANGED": states[currentRoomName] = Object.assign({}, states[currentRoomName], { currentVideo: action.currentVideo }); break;
               case "VIDEO_DELETED": states[currentRoomName] = Object.assign({}, states[currentRoomName], { videos: action.videos }); break;
               case "VIDEO_ADDED": states[currentRoomName] = Object.assign({}, states[currentRoomName], { videos: action.videos }); break;
           }
           console.log("AFTER",states[currentRoomName].currentVideo)

           client.broadcast.to(currentRoomName).emit("UPDATE_FROM_SERVER", action)
        }
        catch(e){
            console.log(e)
        }
    })
    
    client.on("SYNC_TO_SERVER",(player)=>{
        states[currentRoomName] = Object.assign({},states[currentRoomName],Object.assign({},states[currentRoomName].player,{player:player.payload}))
        client.to(currentRoomName).emit("PLAYER_SYNC", {type:"PLAYER_UPDATED",id:client.id,payload:states[currentRoomName].player})
    })
    client.on("MESSAGE_SENT",(data)=>{
        let messages = states[currentRoomName].chat || [];
        messages.push({user:getUserNameByID(currentRoomName,client.id,socket),id:client.id,message:data.message})
        states[currentRoomName].chat = messages
        socket.to(currentRoomName).emit("UPDATE_FROM_SERVER",{type:"CHAT_UPDATED",payload:states[currentRoomName].chat}) 
    })
    client.on("VIDEO_PLAY",()=>{

    })
})



function isRoomExist(roomName)
{
    if(rooms.hasOwnProperty(roomName))
        return true
    else
        return false
}
function error(type,description)
{
    return {
        type:type,
        description: description
    }
}

function getUsersName(room,socket)
{
    let usersInRoom = []
    Object.keys(rooms[room].sockets).map((clientID)=>{
        usersInRoom.push(socket.sockets.sockets[clientID].nickname)          // I dont like this s h i t but this is the simplest wat to find socket of connected users
    })
    return usersInRoom
}
function getUserNameByID(room,clientID,socket)
{
  
   
    return  socket.sockets.sockets[clientID].nickname
}
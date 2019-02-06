
import SocketIO from 'socket.io'
const socket = SocketIO(3001)
const rooms = socket.sockets.adapter.rooms  
let states = {}

socket.on("connection",(client)=>{
    var currentRoomName;  //Using for tracking disconected users, and notify everyone in this room
    console.log("New connection",client.id)
    client.nickname = "User"+client.id;


    client.on("disconnect",()=>{
        try {
            states[currentRoomName] = Object.assign({},states[currentRoomName],{
                users: Object.keys(rooms[currentRoomName].sockets),
                roomName: currentRoomName
            })
            socket.to(currentRoomName).emit("USER_DISCONNECTED", states[currentRoomName])

        }
        catch (e) {

        }
    })
    client.on("JOIN_ROOM",(room)=>{
        console.log("JOIN_ROOM by",client.id)
      
            console.log("JOINED",client.nickname)
            client.leaveAll();
            client.join(room)
            currentRoomName = room
            states[room] = Object.assign({},states[room],{users: Object.keys(rooms[room].sockets),roomName:room})
            console.log (states[room]) 
            client.emit("ROOM_JOINED",states[room])
            socket.to(room).emit("USER_CONNECTED",states[room])
            socket.to(room).emit("UPDATE_FROM_SERVER",{type:"INIT_STORE",state:states[room]})


     
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
           switch (action.type) {
               case "VIDEO_SELECTED": states[currentRoomName] = Object.assign({}, states[currentRoomName], { currentVideo: action.currentVideo }); break;
               case "VIDEO_DELETED": states[currentRoomName] = Object.assign({}, states[currentRoomName], { videos: action.videos }); break;
               case "VIDEO_ADDED": states[currentRoomName] = Object.assign({}, states[currentRoomName], { videos: action.videos }); break;
           }

           client.broadcast.to(currentRoomName).emit("UPDATE_FROM_SERVER", action)
        }
        catch(e){}
    })
    
    client.on("SYNC_TO_SERVER",(player)=>{
        states[currentRoomName] = Object.assign({},states[currentRoomName],Object.assign({},states[currentRoomName].player,{player:player.payload}))
        client.to(currentRoomName).emit("PLAYER_SYNC", {type:"PLAYER_UPDATED",id:client.id,payload:states[currentRoomName].player})
    })
    client.on("VIDEO_PAUSE",()=>{
        
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

function createRoomState()
{
    return {
        users:[],
        videos:[],
        currentVideo:0,
        videoTime:0,
    }
}
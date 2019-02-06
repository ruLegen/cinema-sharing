import io from 'socket.io-client'
const server = ""
const socket = io('https://878bc64d.ngrok.io')



function subscribeToError(callback) {
    socket.on('ERROR', data => callback(data));
}
function subscribeToRoomJoined(callback) {
    socket.on('ROOM_JOINED', data => callback(data));
}
function subscribeToUserConnected(callback) {
    socket.on('USER_CONNECTED', data => callback(data));
}
function subscribeToUserDisconnected(callback) {
    socket.on('USER_DISCONNECTED', data => callback(data));
}
function subscribeToRoomCreated(callback) {
    socket.on('ROOM_CREATED', data => callback(data));
}

function subscribeToUpdateFromServer(callback) {
    socket.on('UPDATE_FROM_SERVER', store => callback(store));
}
function subscribeToPlayerSync(callback) {
    socket.on('PLAYER_SYNC', store => callback(store));
}
function emitEvent(name, payload,callback) {
    socket.emit(name, payload)
}


export {    socket, 
            emitEvent,
            subscribeToError,
            subscribeToRoomJoined,
            subscribeToRoomCreated,
            subscribeToUserConnected,
            subscribeToUserDisconnected,
            subscribeToUpdateFromServer,
            subscribeToPlayerSync
        }
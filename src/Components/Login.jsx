import React from 'react'
import {Fragment} from 'react'
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, DialogContentText } from '@material-ui/core';
import {subscribeToError,subscribeToRoomCreated,subscribeToRoomJoined, emitEvent} from '../js/socket'
import { func } from 'prop-types';
import Room from '../Pages/Room';
const handleJoin =(event)=>{
      emitEvent("CHANGE_ROOM",event.target.value)
}
const handleCreate =(event)=>{
    emitEvent("CREATE_ROOM",event.target.value)
      
}

class Login extends React.Component {
    constructor(props)
    {
        super(props)
        this.state = {
            joined:false,
            roomName:""
        }
        subscribeToRoomCreated((data)=>{
            this.setState((state)=>{
                return {...state,...{joined:true,roomName:data}}
            })
        })
        subscribeToRoomJoined((data)=>{
            this.setState((state)=>{
                return {...state,...{joined:true,roomName:data}}
            })
        })
    }

    render()
    {
        return <CurrentRoom {...this.state} onJoinClick={handleJoin} onCreateClick={handleCreate}/>
    }

}

function CurrentRoom(props){
    if(props.joined)
        return <Room roomName={props.roomName}/>
    else
    {
        return(
        <Dialog open
            aria-labelledby="form-dialog-title"
            maxWidth={'xs'}
            fullWidth>
            <DialogTitle id="form-dialog-title"></DialogTitle>
            <DialogContent>
                <DialogContentText>Enter Room name</DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Room name"
                    fullWidth />
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onJoinClick} color="primary">Join</Button>
                <Button onClick={props.onCreateClick} color="primary">Create</Button>
            </DialogActions>
        </Dialog>
    )}
}
export default Login
import React from 'react'
import Grid from '@material-ui/core/Grid'
import {PlayListPanel,UserListPanel,MiddlePanel, VideoPlayer, Chat} from "../Components"
import { GridList, GridListTile } from '@material-ui/core';
import FormLabel from '@material-ui/core/FormLabel';
import {emitEvent, 
        subscribeToError,
        subscribeToRoomJoined, 
        subscribeToUserConnected ,
        subscribeToUserDisconnected,
        subscribeToUpdateFromServer} from '../js/socket';
import {connect} from 'react-redux'

const styles = {
    black:{
        backgroundColor:"black",
        heigth:"100%",  
    },
    yellow:{
        backgroundColor:"yellow",
    },
    userPanel:{
        backgroundColor:"red",
        heigth:"100%",
        wordWrap: "break-word"
    },
    mainContainer:{
        backgroundColor:"#eeeeee",
        height: "-webkit-fill-available"
    },
    listStyle:{
        heigth:"100px",
        backgroundColor:"#ff33ee",
    }
}
const DispatchToProps = (dispatch)=>{

    return {
        userUpdated: (users)=>{
            dispatch({type:"USER_UPDATE",payload:users})
        },
        updateFromServer: (store)=>{
            dispatch({type:"UPDATE_FROM_SERVER",payload:store})
        }
    }
}
class Room extends React.Component
{
    constructor(props)
    {
        super(props)
        this.state = {
            available: false,
            text:"",
            roomName:"",
            messages:[]
        }

        subscribeToRoomJoined((data)=>{
            this.setState((state)=>{
                return {...state,...{available:true,roomName:data.roomName}}
            })
            connect(null,DispatchToProps)(Room);
        })
        subscribeToError((data)=>{
            this.setState((state)=>{
                return {...state,...{text:data.description}}
            })
        })
        subscribeToUserConnected((data)=>{
            this.props.userUpdated(data.users)
        })
        subscribeToUserDisconnected((data)=>{
            this.props.userUpdated(data.users)
        })
        subscribeToUpdateFromServer((store)=>{
            this.props.updateFromServer(store)
        })
        emitEvent("JOIN_ROOM",this.props.roomName);

    };  
    componentDidMount(){

    }


    render()
    {
      return <CurrentRoom {...this.state}/>
    }
}
function CurrentRoom(props){
    console.log(props)
    if(props.available)
    {
        return(
            <Grid container spacing={16} style={styles.mainContainer}>
                <Grid item xs={2} justify="center">
                    <center><FormLabel>{props.roomName}</FormLabel></center>
                     <UserListPanel listStyle={styles.listStyle}/>
                </Grid>

                <Grid item xs={8}>
                   <MiddlePanel/>
                </Grid>
                
                <Grid item xs={2}>
                 <PlayListPanel/>
                </Grid>
                
            </Grid>
        );
    }
    else
    {
        return (<b>{props.text}</b>); // add some css to warning
    }
}
export default connect(null,DispatchToProps)(Room);
import React, { Component } from 'react';
import { Paper, Button } from '@material-ui/core';
import ReactPlayer from 'react-player';
import {connect} from 'react-redux';
import {emitEvent} from '../js/socket';
import {subscribeToPlayerSync} from '../js/socket'
function mapStateToProps(state)
{
    return{
        isPlaying:state.player.isPlaying,
        time:state.player.currentTime
    }
}
function mapDispatchToProps(dispatch){
    return{
        syncToServer:(playerState)=>{
            console.log("SYNCE TO SERVER")
            emitEvent("SYNC_TO_SERVER",{type:"PLAYER_UPDATED",payload:playerState})
        },
        togglePlayerTo: (state)=>{
            dispatch({type:"TOGGLE_PLAYER_TO",payload:{isPlaying:state}})
        },
        currentTimeChanged: (time)=>{
            dispatch({type:"CURRENT_TIME_CHANGE",payload:{currentTime:time}})
        },
        dispatch: (action)=>{
            dispatch(action)
        }
    }
}

class VideoPlayer extends Component 
{
    constructor(props){
        super(props);
        this.player = React.createRef()
        this.state = {
            isSyncable:true,
        }
        subscribeToPlayerSync((data)=>{
        let player = this.player.current
            this.setState((state)=>{return {...state,isSyncable:false} },()=>{
                player.seekTo(data.payload.currentTime)
                this.props.dispatch({type:"UPDATE_FROM_SERVER",payload:{...data}})
                console.log("INFO FROM SERVER",data,this.state.fromServer)
            })

         })
    }

    handleProgress = (event)=>{
           let player = this.player.current
           let isPlaying = this.props.isPlaying
      //     if(this.state.isSyncable)
     //      {
               if (Math.abs(player.getCurrentTime() - this.props.time * player.getDuration()) > 1) {
                   this.handleSeek(player.getCurrentTime() / player.getDuration())
               }
      //     }
           this.props.currentTimeChanged(player.getCurrentTime() / player.getDuration())

    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        let player = this.player.current
        console.log(prevState.isSyncable,this.state.isSyncable)

        if(this.state.isSyncable)
        {

            if(prevProps.isPlaying == false && this.props.isPlaying == true)
            {
                console.log("PASSED")
                this.props.syncToServer({ isPlaying: this.props.isPlaying, currentTime: player.getCurrentTime() / player.getDuration() })
            }
            
            if(prevProps.isPlaying == true && this.props.isPlaying == false)
            {
                console.log("PASSED")
                this.props.syncToServer({ isPlaying: this.props.isPlaying, currentTime: player.getCurrentTime() / player.getDuration() })
            }
           
        }
    }

    handlePause = (event)=>{
        this.props.togglePlayerTo(false)
    } 
    handlePlay = (event)=>{
       this.props.togglePlayerTo(true)

    }
    handleSeek =(time)=>{
        let player = this.player.current
        if(this.state.isSyncable)
        {
            console.log("SEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEeEK", time, this.state.fromServer)
            player.seekTo(time)
            this.props.togglePlayerTo(true)
            this.props.syncToServer({isPlaying:true,currentTime:player.getCurrentTime()/player.getDuration()})    
 
        }
        this.setState((state)=>{return {...state,isSyncable:true}})

           
    }
    componentDidMount=()=>{
        let player = this.player.current
        player.seekTo(this.props.time)
   
    }
    render(){
        return (
            <Paper style={this.props.style}>
                <ReactPlayer    ref={this.player}
                                onProgress={this.handleProgress}
                                onPause={this.handlePause}
                                onPlay={this.handlePlay}
                                onSeek={this.handleSeek}
                                progressInterval={50}
                                playing={this.props.isPlaying}
                                url={this.props.videoUrl}
                                controls
                                width='100%'
                                height='100%'> playing

                </ReactPlayer>

            </Paper>
        );
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(VideoPlayer);
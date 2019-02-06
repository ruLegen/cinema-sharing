import React, { Component } from 'react';
import { Paper, Button } from '@material-ui/core';
import ReactPlayer from 'react-player';
import {connect} from 'react-redux';
import {emitEvent} from '../js/socket';
import {subscribeToPlayerSync} from '../js/socket'
function mapStateToProps(state)
{
    console.log(state)
    return{
        isPlaying:state.player.isPlaying,
        time:state.player.currentTime
    }
}
function mapDispatchToProps(dispatch){
    return{
        syncToServer:(playerState)=>{
            console.log("SYNCE TO SERVER")
            dispatch({type:"PLAYER_UPDATE",payload:playerState})
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
        subscribeToPlayerSync((data)=>{
            console.log("INFO FROM SERVER",data)
            this.props.dispatch({type:"UPDATE_FROM_SERVER",payload:{...data}})
            this.player.current.seekTo(this.props.time)
        })
    }

    handleProgress = (event)=>{
        let player = this.player.current
        let isPlaying = this.props.isPlaying
        if(Math.abs(player.getCurrentTime() - this.props.time*player.getDuration()) > 1)
        {
            this.handleSeek(player.getCurrentTime()/player.getDuration())
        }
        console.info(this.props.isPlaying, player.props.playing)

      
        this.props.currentTimeChanged(player.getCurrentTime()/player.getDuration())

     
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        let player = this.player.current
        if (prevProps.isPlaying !== this.props.isPlaying) {
            // Do whatever you want  if(this.props.isPlaying != isPlaying)
            this.props.syncToServer({isPlaying:this.props.isPlaying})
        }
    }

    handlePause = (event)=>{
        let player = this.player.current
        this.props.togglePlayerTo(false)
    //    this.props.syncToServer({isPlaying:false})

    } 
    handlePlay = (event)=>{
        let player = this.player.current
        this.props.togglePlayerTo(true)
        //this.props.syncToServer({isPlaying:true})

    }
    handleSeek =(time)=>{
        console.log("SEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEeEK", time)
        let player = this.player.current
        this.props.syncToServer({isPlaying:this.props.playing,currentTime:player.getCurrentTime()/player.getDuration()})
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
                                progressInterval={300}
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
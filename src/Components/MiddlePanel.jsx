import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid'
import {VideoPlayer,Chat} from './index'
import {connect} from 'react-redux'

const styles = {
    video:{
        width:"100%",
        height:"61%",
        padding:"0.5%",    
    },
    chat:{
        width:"100%",
        height:"39%",
        padding:"0.5%",
    }
};
const middlePanelNodeStyle={
    height:"100%",
    fontSize:"4vh"

}
const mapStateToProp = (stateFromStore,ownProps)=>{
    let videoURL = ''
    if(stateFromStore.videos[stateFromStore.currentVideo])
        videoURL = stateFromStore.videos[stateFromStore.currentVideo].url
    return {
        currentVideo: videoURL
    }
}
class MiddlePanel extends Component 
{
    constructor(props){
        super(props);
    }
    render(){
        return (
            <Grid container item  lg={9} style={{height:"90vh",maxWidth:"100%"}} direction="column">
                <Grid item style={styles.video}>
                    <VideoPlayer style={middlePanelNodeStyle} videoUrl={this.props.currentVideo}></VideoPlayer>
                </Grid>

                <Grid item style={styles.chat}>
                    <Chat style={middlePanelNodeStyle}></Chat>
                </Grid>
            </Grid>
        );
    }
}

export default connect(mapStateToProp)(MiddlePanel);
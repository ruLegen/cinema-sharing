import React from 'react'
import { Typography, Paper, Chip } from '@material-ui/core';
import {blue,green} from '@material-ui/core/colors'

function getStyleForBlock(isMine)
{
    let float = isMine ? 'right':"left";
    let justify = isMine? 'flex-end':'flex-start'; 
    return {
        width: '80%',
        //display: 'flex',
        miHeight: '15%',
        wordBreak:"break-all",
        justifyContent: justify,
        float: float,
        marginTop:"1%",
        marginBottom:"1%",
    }
}

class Message extends React.Component{
    constructor(props)
    {
        super(props)
    }

    render(){
        return (
            <div style={getStyleForBlock(this.props.isMine)}>
             <Chip  style={{float: this.props.isMine? 'right':'left'}} label={this.props.user} />  <br></br>          
             <Paper style={{ padding:"1%",backgroundColor: this.props.isMine? green[500]:blue[500],float: this.props.isMine? 'right':'left',}}>
                <Typography color="textPrimary">
                  {this.props.text}  
                </Typography>
            </Paper>
            </div>
            )
    }
}
export default Message

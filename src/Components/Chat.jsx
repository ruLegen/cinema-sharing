import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid'
import { Paper } from '@material-ui/core';
class Chat extends Component 
{
    constructor(props){
        super(props);
    }
    render(){
        return (
        <Paper style={this.props.style}>
         
            it'S Chat should be plaYER SHOULD BE
        </Paper>
        );
    }
}

export default Chat;
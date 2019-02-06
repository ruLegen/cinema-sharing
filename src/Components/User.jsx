import React, { Component } from 'react';
import Chip from '@material-ui/core/Chip';
import { ListItem, ListItemText } from '@material-ui/core';
import blue from "@material-ui/core/colors/blue"
class User extends Component 
{
    constructor(props){
        super(props);
    }
    

    render(){
        return (
            <ListItem button style={{backgroundColor:"#EEEEEE",fontSize:"1.8vh"}}>
             <ListItemText wrap style={{fontSize:"1.8vh"}} primary={this.props.name} />
            </ListItem>
        );
    }
}

export default User;
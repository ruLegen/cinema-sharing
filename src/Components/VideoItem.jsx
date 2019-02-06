import React, { Component, Fragment } from 'react';
import { IconButton,Card, CardHeader,CardMedia, CardContent, Typography, Grid } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

const styles={
    textStyle:{
        width: "25%",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
    },
    smallIcon: {
        width: '1vh',
        height: '1vh',
      },
    small: {
        width: '2vh',
        height: '2vh',
        padding: 0,
        float:"right"
      },
}
class VideoItem extends Component 
{
    constructor(props){
        super(props);
        this.state={
            visible:true,
            id: this.props.index+1 || -1
        }
    }
    
    createCardStyle = ()=>{
        let highlight={}
        if(this.props.selected)
             highlight = {boxShadow:"rgb(255, 0, 0) -4px 1px 10px"}    
        return {...{width:"100%",height: "20vh",marginBottom:"3%"},...highlight}
    }
    render(){
        return (
            <Card style={this.createCardStyle()}>
                <CardMedia onClick={(e)=>{this.props.onClickHandle(e,this.state.id)}} style={{width:"100%",height: "15vh"}} square  image={this.props.image}
                            title="Paella dish"
                />                  
               <CardContent style={{padding:"1vh"}}>
                        <Typography title={this.props.text || "This is the big text wich cant be inside "} 
                                    style={{fontSize:"1.9vh",
                                            maxWidth:"85%",
                                            position:"absolute"}} 
                                    noWrap 
                                    color="textSecondary" 
                                    gutterBottom>
                            {this.props.text || "This is the big text wich cant be inside "} 
                        </Typography>    
                        <IconButton
                            iconStyle={styles.smallIcon}
                            style={styles.small}>
                            
                            <DeleteIcon data-index={this.props.index} style={{height:"3vh",width:"3vh"}} onClick={(e)=>{this.props.onDeleteClick(e,this.state.id)}}/>
                        </IconButton>          
                 </CardContent>
 
            </Card>
        );
    }
}

export default VideoItem;
import React, { Component, Fragment } from 'react';
import ReactPlayer from 'react-player'
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, Card, CardActionArea, CardMedia } from '@material-ui/core';
import {CreateNewVideoItem} from '../js/Utils'
import {connect} from 'react-redux'
import {emitEvent} from '../js/socket'

function PreviewItem(props){
    let thumb = props.thumbnail
    if(props.active)
    {
        return  <Card style={{width:"100%", height:thumb.height}}>
                <img src={thumb.url} style={{width:"100%", height:"100%"}}></img>
            </Card>
    }
    else
    return <b></b>
                    
}


function mapDispatchToProps(dispatch){

    return {
        addVideo: (videoItem)=>{
            console.log("Dispatched VIDEO_ADDED")
                dispatch({
                    type:"VIDEO_ADDED",
                    payload: videoItem
                })
    
            }
        }
}
class OfferButton extends Component 
{
    constructor(props){
        super(props);
        this.state = {
            open:false,
            text:"",
            thumbnail:{
                width:0,
                heigth:0,
                url:""
            },
            isPlayable: false, 
        }
    }
    handleClickOpen =()=>{
        this.setState((currentState,props)=>{
            return {open:true}
        })
    }
    handleClose = ()=>{
        this.setState((state)=>{
                    
            return {text:"",
                    thumbnail:{
                        width:"",
                        height:"",
                        url: ""
                    },
                    isPlayable:false,
                    open:false,
                    videoItem:{}
                    }
        })
    }
    handleSubmit = ()=>{
        
        this.props.addVideo(this.state.videoItem)
        emitEvent('CHANGE_ROOM', this.state)
        this.setState((state)=>{
                    
            return {text:"",
                    thumbnail:{
                        width:"",
                        height:"",
                        url: ""
                    },
                    isPlayable:false,
                    open:false,
                    videoItem:{}
                    }
        })
    }
    //Here is fetching the title and thumbnail for video
    handleChange = (event)=>{
        event.persist()
        if(ReactPlayer.canPlay(event.target.value)){
            fetch("https://noembed.com/embed?url="+event.target.value).then((result)=>{
                return result.json()
            }).then((data)=>{
                this.setState((state)=>{
                    
                    return {
                            text:data.title,
                            thumbnail:{
                                width:data.thumbnail_width,
                                height:data.thumbnail_height,
                                url: data.thumbnail_url
                            },
                            isPlayable:true,
                            videoItem:CreateNewVideoItem(data.title,data.url,data.thumbnail_url)
                        }
                })

            }).catch(()=>{
                this.setState((state)=>{
                    return {text:"",imgUrl:""}
                })
            })
        }
        else{
            this.setState(()=>{

                return {
                        text:<b>This video cannot be played</b>,
                        isPlayable:false
                    }
            })
        }
        
    }
    render(){
        return (
        <Fragment>
        <Button style={{width:"98%"}} variant="outlined" color="primary" onClick={this.handleClickOpen}>
           Offer Video
        </Button>
        <Dialog open={this.state.open} 
                onClose={this.handleClose} 
                aria-labelledby="form-dialog-title" 
                fullWidth 
                maxWidth={'sm'}>
            <DialogTitle id="form-dialog-title">Enter video URL</DialogTitle>
            <DialogContent>
              <PreviewItem  title={this.state.text} 
                            thumbnail={this.state.thumbnail} 
                            active={this.state.isPlayable}/>
              <DialogContentText>
               {this.state.text}
                
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="standard-with-placeholder"
                label="PLease enter video URL"
                placeholder="video URL"
                fullWidth
                onChange = {this.handleChange}
              />
            </DialogContent>
            <DialogActions>
              <Button   disabled={!this.state.isPlayable} 
                        onClick={this.handleSubmit} 
                        color="primary">
                Submit
              </Button>
              <Button   onClick={this.handleClose} 
                        color="primary">
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
          </Fragment>

        );
    }
}

export default connect(null,mapDispatchToProps)(OfferButton);
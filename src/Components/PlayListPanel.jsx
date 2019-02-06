import React, { Component, Fragment } from 'react';
import { GridList, GridListTile, withStyles } from '@material-ui/core';
import VideoItem from './VideoItem';
import ImageArray from './ImageArray'
import {connect} from 'react-redux'

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
const styles = {
    gridList:{
        root: {
            display: 'flex',
            flexWrap: 'wrap',
            listStyle: 'none',
            padding: 0,
            WebkitOverflowScrolling: 'touch',
            },
    },
    gridListTile:{
        root:{
            boxSizing: "border-box", //this to lines object already have, added cuz root replaceable
            flexShrink: 0,
            height: "95vh !important", //my own prop
            width: "100% !important",
            padding: "2px !important",
        },
        tile:{
            height: "100%",
            display: "block",
            position: "relative",
            overflow: "visible"
        }
    },
    gridButton:{
        marginTop:"1%",
    }
};

const StyledGridList = withStyles(styles.gridList)(GridList);
const StyledGridListTile = withStyles(styles.gridListTile)(GridListTile);

var CreateVideoObject = (url,img,text)=>{

    return {
        url:url,
        img:img,
        text:text
    }
}


const mapStateToProp = (state)=>{

    return {
        videoItems:state.videos,
        currentVideo:state.currentVideo
    }
}
const mapDispatchToProp = (dispatch,ownProps)=>{
    return {
        onClick: (event,index)=>{
             console.log(index)
            dispatch({
                type:"VIDEO_SELECTED",
                payload:index
            })
        },
        onDeleteHandle:(event,index)=>{
            dispatch({
                type:"VIDEO_DELETED",
                payload:index
            })
        }
    }
}
class PlayListPanel extends Component 
{
    constructor(props){
        super(props);
        this.state={
            videoArray:[]
        }
    }


    onDeleteHandle = (event,index)=>{
        event.persist()
        this.setState((state)=>{
            //here dispatch action somehow
            let currentState = state.videoArray;
            currentState.splice(index-1,1)
        })

    }

    render()
    {
        return(
        <StyledGridList cols={1} >
            <StyledGridListTile >
                {
                   this.props.videoItems.map((element,index)=>{
                       console.log(element)
                    let isSelected = false;   
                    if(this.props.currentVideo == index)
                        isSelected = true;
                     return <VideoItem image={element.thumbnail} 
                             text={element.title} 
                             onDeleteClick={this.props.onDeleteHandle}
                             onClickHandle={this.props.onClick}
                             index={index}
                             selected={isSelected}
                             />
                    })
                }
            </StyledGridListTile>
        </StyledGridList>
            );
    }
}

export default connect(mapStateToProp,mapDispatchToProp)(PlayListPanel);
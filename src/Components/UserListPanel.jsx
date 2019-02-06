import React, { Component, Fragment } from 'react';
import Grid from '@material-ui/core/Grid'
import { GridList, GridListTile, withStyles } from '@material-ui/core';
import User from './User';
import OfferButton from './OfferButton';
import {connect} from 'react-redux'
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
            height: "85vh !important", //my own prop
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
        marginTop:"2%",
    }
};

const StyledGridList = withStyles(styles.gridList)(GridList);
const StyledGridListTile = withStyles(styles.gridListTile)(GridListTile);

function StateToProps(state){
    return {
        users:state.users
    }
} 


class UserListPanel extends Component 
{
    constructor(props){
        super(props);
        
    }
    
    render(){

        return (
            <Fragment>
                <StyledGridList cols={1} >
                    <StyledGridListTile >

                    {
                        this.props.users.map((item,index)=>{
                           return <User name={item}/>
                        })
                    }
                    </StyledGridListTile>
                </StyledGridList>
                <Grid item style={styles.gridButton}>
                    <OfferButton/>
                </Grid>
            </Fragment>
        );
    }
}

export default connect(StateToProps)(UserListPanel);
import React, { Component, Fragment } from 'react';
import Grid from '@material-ui/core/Grid'
import { Paper, TextField, Button, Input } from '@material-ui/core';
import Message from './Message';
import { connect } from 'react-redux';
import { socket,emitEvent } from '../js/socket';

const mapStateFromStore = (state)=>{
    return {
        messages:state.chat
    }
}
class Chat extends Component 
{
    constructor(props){
        super(props);
        this.state={
            text:""
        }
        this.textField = React.createRef()
    }
  
    handleInputChange = (event)=>{
        event.persist()
        this.setState((state)=>{return {text:event.target.value}})
    }
    handleButtonClick = (event)=>{
        console.log(this.state.text)
        if(this.state.text.length >0)
        emitEvent("MESSAGE_SENT",{message:this.state.text})
        this.setState((state)=>{return {text:""}})
    }
    render(){
        return (
            <Fragment>
        <div style={this.props.style}>
        <Paper>
           {
               this.props.messages.map((element,index)=>{
                   if(element.id == socket.id)
                        return <Message user={element.user} isMine={true} text={element.message}/>
                    else
                        return <Message user={element.user} isMine={false} text={element.message}/>

               })
           }
        </Paper>
        </div>
        <Paper>
           <Input value={this.state.text} onChange={this.handleInputChange} ref={this.textField} style={{width:"90%",padding:"0.6%"}} placeholder="Type message">asdasd</Input>
           <Button onClick={this.handleButtonClick} style={{width:"8%",margin:"0.4%"}}>Send </Button>
        </Paper>
        </Fragment>
        );
    }
}

export default connect(mapStateFromStore)(Chat);
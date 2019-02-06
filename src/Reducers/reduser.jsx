import combineReducers from 'react-redux'
import {removeItem,addItem} from '../js/supportFunctions'
import {emitEvent} from '../js/socket'

const initState = {
    
 
    videos:[],
    currentVideo:0,
    users:[],
    player:{
        isPlaying:false,
        currentTime:0,
    },
    syncID:""
}

//never mutate the state, it may cause to non automatic render components
const Reducer = (state = initState,action)=>{
    let newState= {}
    switch(action.type)
    {
        case "VIDEO_SELECTED":      //When user selected new video
            newState = {...state,...{currentVideo:action.payload-1}}
            emitEvent("USER_ACTION",{type:"CURRENT_VIDEO_CHANGED",
                                        currentVideo:action.payload-1})
            break;
        case "VIDEO_DELETED":       //When user deleted video from playlist
            let videoArray = state.videos;
            newState = {...state,...{videos:removeItem(videoArray,action)}} 
            emitEvent("USER_ACTION",{type:"VIDEO_DELETED",
                                    videos:removeItem(videoArray,action)})
            break;
        case "VIDEO_ADDED":         //When user's offered video applyed
            newState = {...state,...{videos:addItem(state.videos,action)}}
            emitEvent("USER_ACTION",{type:"VIDEO_ADDED",
                                     videos:addItem(state.videos,action)})
            break;
        case "USER_UPDATE":         //When user come in / leave room 
            newState = {...state,...{users:action.payload}}
            break;
        case "TOGGLE_PLAYER_TO":
            newState = {...state,player:{...state.player,...action.payload}}
            break;
        case "CURRENT_TIME_CHANGE":
            newState = {...state,player:{...state.player,...action.payload}}
            break;
        case "UPDATE_FROM_SERVER": //Any infomration comming from server
            switch (action.payload.type) {
                case "CURRENT_VIDEO_CHANGED":
                    newState = {...state,...{currentVideo:action.payload.currentVideo}}
                    break;
                case "VIDEO_DELETED":
                    newState = {...state,...{videos:action.payload.videos}}
                    break;
                case "VIDEO_ADDED":
                    newState = {...state,...{videos:action.payload.videos}}
                    break;
                case "INIT_STORE":
                    newState = {...state,...action.payload.state}
                    break;
                case "PLAYER_UPDATED":
                    newState = {...state,player:{...state.player,...action.payload.payload}} //watch later
                    break;
                default: newState = state
                    break;
            } 
            break;
        default: newState= state;
        
    }
    return newState
}
export default Reducer 

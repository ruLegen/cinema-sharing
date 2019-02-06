import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import Room from './Pages/Room';
import {Provider} from 'react-redux'
import { createStore } from 'redux';
import Reducer from './Reducers/reduser'
import {socket} from './js/socket'
import {BrowserRouter as Router,Route} from 'react-router-dom';
import Login from './Components/Login';


const store = createStore(Reducer,window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Fragment>
        <Route path="/" exact component={Login} />
        <Route path={"/room/:roomName"} exact render={(match) => {
          let roomName = match.match.params.roomName
          return <Room roomName={roomName} socket={socket} />
        }} />
      </Fragment>
    </Router>
  </Provider>,

  document.getElementById('root'));

import React, {Component} from 'react';
import socketIOClient from 'socket.io-client';
import logo from './logo.svg';
import './App.css';

class App extends Component {

  state = {
    stateValue1: 1,
    stateValue2: 0
  }

  // socket = socketIOClient('');

  componentDidMount() {
    const socket = socketIOClient(window.location.hostname);
    socket.emit('callToServer', (serverResponse) => {
      // alert(serverResponse);
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            This is the Island Rush Game...
          </p>
        </header>
      </div>
    );
  }
}

export default App;

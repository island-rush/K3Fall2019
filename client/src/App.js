import React, {Component} from 'react';
import socketIOClient from 'socket.io-client';
import './App.css';

class App extends Component {

  componentDidMount() {
    const socket = socketIOClient(window.location.hostname);
    // socket.emit('callToServer', (serverResponse) => {
    //   // alert(serverResponse);
    // });
    // socket.on('gameState', (gameState) => {
    //   this.setState(gameState);
    // });
  }

  render() {
    return (
      <div className="App">
        <p>This is the App. (under construction...)</p>
      </div>
    );
  }
}

export default App;

import React, {Component} from 'react';
import socketIOClient from 'socket.io-client';
import logo from './logo.svg';
import './App.css';

class App extends Component {

  state = {
    //Client's Data
    gameSection: "",
    gameInstructor: "",
    gameTeam: -1,
    gameController: -1,

    //Game Data
    positions: [[{},{},{}],[],[],[],[]],
    


  }

  componentDidMount() {
    const socket = socketIOClient(window.location.hostname);
    // socket.emit('callToServer', (serverResponse) => {
    //   // alert(serverResponse);
    // });
    socket.on('gameState', (gameState) => {
      this.setState(gameState);
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            {this.state.gameSection}
          </p>
        </header>
      </div>
    );
  }
}

export default App;

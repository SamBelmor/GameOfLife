import React, { Component } from 'react';
import Board from './components/Board';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1>Game of Life</h1>
        <p>
          <h3>Game rules</h3>
          1. Each cell with one or no neighbors dies, as if by solitude. <br />  
          2. Each cell with four or more neighbors dies, as if by overpopulation. <br />
          3. Each cell with two or three neighbors survives.
          <br />
          <br />
          <br />
          <h3>Instuctions</h3>
          Choose the quantity of cell alive that you wish and play start.
        </p>
        <Board />
      </div>
    )
  }
}

export default App;

import React, { Component } from 'react';
import Cell from './Cell';
import { Button } from 'reactstrap';
import './Style.css' 

const TABLE_WIDTH = 600; 
const TABLE_HEIGHT = 500; 
const SIZE_OF_CELL = 25; 

class Board extends Component {
  constructor() {
    super();

    //create board size
    this.rows = TABLE_HEIGHT / SIZE_OF_CELL;
    this.cols = TABLE_WIDTH / SIZE_OF_CELL;
    this.board = this.createEmptyBoard(); 
  }

  state = {
    cells : [],
    isActive: false
  }

  //iterate through rows and colums in each position of the board and create an array with values = false
  createEmptyBoard = () => {
    let board = [];
    for (let y = 0; y < this.rows; y++) {
      board[y] = [];
      for (let x = 0; x < this.cols; x++) {
        board[y][x] = false;
      }
    }
    return board;
  }

  createNewCells = () => {
    let cells = [];
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        if (this.board[y][x]) {
          cells.push({ x, y });
        }
      }
    }
    return cells;
  }

  positionOnViewport = () => {
    // https://developer.mozilla.org/es/docs/Web/API/Element/getBoundingClientRect
    //returns the size of an element and its position relative to the viewport
    const returnHTML = document.documentElement;
    const DOMrect = this.boardRef.getBoundingClientRect();    
    
    return {
      x: (DOMrect.left + window.pageXOffset) - returnHTML.clientLeft,
      y: (DOMrect.top + window .pageYOffset) - returnHTML.clientTop,
    }
  }

  // find the position of the clicked cell 
  clickedPosition = (event) => {
    const clickedPosition = this.positionOnViewport();
    const positionX = event.clientX - clickedPosition.x;
    const positionY = event.clientY - clickedPosition.y;

    //get the coordinate from the clicked cell
    const x = Math.floor(positionX / SIZE_OF_CELL);
    const y = Math.floor(positionY / SIZE_OF_CELL);

    //change the state of the current position
    if (x >= 0 && x <= this.cols && y >= 0 && y <= this.rows) {
      this.board[y][x] = !this.board[y][x];
    }

    this.setState({ cells: this.createNewCells() }); //change the state, active or deactivate the square
  }

  start = () => { 
    this.setState({ isActive: true });
    this.gameRules();
  }

  stop = () => {
    this.setState({ isActive: false });
    if (this.timeoutHandler) {
      window.clearTimeout(this.timeoutHandler);
      this.timeoutHandler = null;
    }
  }

  gameRules = () => {
    let updatedBoard = this.createEmptyBoard();

    //it establish the game rules
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        let neighbors = this.numberOfNeighbors(this.board, x, y);
        if (this.board[y][x]) {
          if (neighbors === 2 || neighbors === 3) { //if cell has 2 or 3 neighbors, the cell lives
            updatedBoard[y][x] = true;
          } else { //if cell has less than 2 neighbors, the cell dies
            updatedBoard[y][x] = false;
          }
        } else {
          if (!this.board[y][x] && neighbors === 3) { // if a dead cell has 3 neighbors, the cell relives
            updatedBoard[y][x] = true;
          }
        }
      }
    }

    //starts iteration each 100 miliseconds
    this.board = updatedBoard;
    this.setState({ cells: this.createNewCells() });
    this.timeoutHandler = window.setTimeout(() => {
      this.gameRules();
    }, 100);
  }

  numberOfNeighbors = (board, x, y) => {
    let neighbors = 0;
    const posibleNeighbors = [[y-1, x-1], [y-1, x], [y-1, x+1], [y, x+1], [y+1, x+1], [y+1, x], [y+1, x-1], [y, x-1]];
    for (let i = 0; i < posibleNeighbors.length; i++) {
      const oneNeighbor = posibleNeighbors[i];
      let neighborInY = oneNeighbor[0];
      let neighborInX = oneNeighbor[1];

      if (neighborInX >= 0 && neighborInX < this.cols) {
        if (neighborInY >= 0 && neighborInY < this.rows) {
          if (board[neighborInY][neighborInX]) {
            neighbors++;
          }
        }
      }
    }
    return neighbors;
  }

  cleanBoard = () => {
    this.board = this.createEmptyBoard();
    this.setState({ cells: this.createNewCells() });
  }

  render() {
    const { cells, isActive } = this.state;
    return(
      <div>
        <span className="controls">
          {isActive ?
          <Button color="success" className="button"
            onClick={this.stop}>Stop</Button> :
          <Button color="warning" className="button"
            onClick={this.start}>Start</Button>
          }
          <Button color="info" className="reset"
            onClick={this.cleanBoard}>Clean board</Button>
        </span>
        <div className="board" 
          style={{ width: TABLE_WIDTH, height: TABLE_HEIGHT, backgroundSize: `${SIZE_OF_CELL}px ${SIZE_OF_CELL}px` }}
          onClick={this.clickedPosition}
          ref={ (n) => { this.boardRef = n; }}> 
          {cells.map(cell => (
            <Cell x={cell.x} y={cell.y}
              key={`${cell.x}, ${cell.y}`} />
          ))}
        </div>
      </div>
    );
  }
}

export default Board;
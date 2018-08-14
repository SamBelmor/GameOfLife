import React, { Component } from "react";

const SIZE_OF_CELL = 25;
export default class Cell extends Component {
  render() {
    const { x, y } = this.props;
    return(
      <div className="Cell" style={{
        left: `${SIZE_OF_CELL * x + 1}px`,
        top: `${SIZE_OF_CELL * y + 1}px`,
        width: `${SIZE_OF_CELL - 1}px`,
        height: `${SIZE_OF_CELL - 1}px`,
      }}></div>
    )
  }
}
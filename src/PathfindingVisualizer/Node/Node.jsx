import React, { Component } from "react";
import "./Node.css";

export default class Node extends Component {
  render() {
    const {
      col,
      isFinish,
      isStart,
      isWall,
      isVisited,
      isPath,
      onMouseDown,
      onMouseEnter,
      onMouseUp,
      row,
    } = this.props;

    // Modified class calculation to handle multiple states
    const extraClasses = [
      isStart ? "node-start" : "",
      isFinish ? "node-finish" : "",
      isWall ? "node-wall" : "",
      isVisited ? "node-visited" : "",
      isPath ? "node-shortest-path" : "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div
        id={`node-${row}-${col}`}
        className={`node ${extraClasses}`.trim()}
        onMouseDown={() => onMouseDown(row, col)}
        onMouseEnter={() => onMouseEnter(row, col)}
        onMouseUp={() => onMouseUp()}
      ></div>
    );
  }
}

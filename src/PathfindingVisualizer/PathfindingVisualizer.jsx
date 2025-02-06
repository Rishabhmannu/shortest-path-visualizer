import React, { Component } from "react";
import Node from "./Node/Node";
import { dijkstra, getNodesInShortestPathOrder } from "../algorithms/dijkstra";
import "./PathfindingVisualizer.css";

const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
      visitedNodes: [],
      timeouts: [],
    };
  }

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({ grid });
  }

  componentWillUnmount() {
    this.clearTimeouts();
  }

  clearTimeouts = () => {
    this.state.timeouts.forEach((timeout) => clearTimeout(timeout));
    this.setState({ timeouts: [] });
  };

  handleMouseDown(row, col) {
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid, mouseIsPressed: true });
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid });
  }

  handleMouseUp() {
    this.setState({ mouseIsPressed: false });
  }

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    this.setState({ visitedNodes: visitedNodesInOrder }, () => {
      this.animateVisitedNodes(0, nodesInShortestPathOrder);
    });
  }

  animateVisitedNodes(index, shortestPath) {
    if (index >= this.state.visitedNodes.length) {
      this.animateShortestPath(shortestPath, 0);
      return;
    }

    const node = this.state.visitedNodes[index];
    this.setState(
      (prevState) => ({
        grid: this.updateNodeVisited(prevState.grid, node),
      }),
      () => {
        const timeout = setTimeout(() => {
          this.animateVisitedNodes(index + 1, shortestPath);
        }, 10);
        this.setState((prev) => ({ timeouts: [...prev.timeouts, timeout] }));
      }
    );
  }

  animateShortestPath(nodesInShortestPathOrder, index = 0) {
    if (index >= nodesInShortestPathOrder.length) return;

    const node = nodesInShortestPathOrder[index];
    this.setState(
      (prevState) => ({
        grid: this.updateNodePath(prevState.grid, node),
      }),
      () => {
        const timeout = setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder, index + 1);
        }, 50);
        this.setState((prev) => ({ timeouts: [...prev.timeouts, timeout] }));
      }
    );
  }

  updateNodeVisited(grid, node) {
    const newGrid = grid.map((row) => [...row]);
    newGrid[node.row][node.col].isVisited = true;
    return newGrid;
  }

  updateNodePath(grid, node) {
    const newGrid = grid.map((row) => [...row]);
    newGrid[node.row][node.col].isPath = true;
    return newGrid;
  }

  visualizeDijkstra() {
    this.clearTimeouts();
    const { grid } = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  clearGrid() {
    this.clearTimeouts();
    this.setState({ grid: getInitialGrid() });
  }

  render() {
    const { grid, mouseIsPressed } = this.state;

    return (
      <>
        <div className="controls">
          <button
            className="visualize-btn"
            onClick={() => this.visualizeDijkstra()}
          >
            Visualize Dijkstra's Algorithm
          </button>
          <button className="clear-btn" onClick={() => this.clearGrid()}>
            Clear Grid
          </button>
        </div>

        <div className="grid">
          {grid.map((row, rowIdx) => (
            <div key={`row-${rowIdx}`}>
              {row.map((node, nodeIdx) => {
                const {
                  row,
                  col,
                  isFinish,
                  isStart,
                  isWall,
                  isVisited,
                  isPath,
                } = node;
                return (
                  <Node
                    key={`node-${row}-${col}`}
                    col={col}
                    isFinish={isFinish}
                    isStart={isStart}
                    isWall={isWall}
                    isVisited={isVisited}
                    isPath={isPath}
                    onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                    onMouseEnter={(row, col) => this.handleMouseEnter(row, col)}
                    onMouseUp={() => this.handleMouseUp()}
                    row={row}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </>
    );
  }
}

const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 20; row++) {
    const currentRow = [];
    for (let col = 0; col < 50; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row) => ({
  col,
  row,
  isStart: row === START_NODE_ROW && col === START_NODE_COL,
  isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
  distance: Infinity,
  isVisited: false,
  isWall: false,
  isPath: false,
  previousNode: null,
});

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.map((row) => [...row]);
  const node = newGrid[row][col];
  newGrid[row][col] = { ...node, isWall: !node.isWall };
  return newGrid;
};

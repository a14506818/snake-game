import React, { Component } from "react";
import "./Board.css";

export default class Board2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      snake: [],
      snakeHead: 0,
      board: [],
      boardRowSize: 30,
      boardColSize: 40,
      snakeDirection: "R",
      food: 0,
      poisonFood: 0,
      score: 0,
      speed: 200,
      border: new Set(),
    };
    document.addEventListener("keydown", (e) => {
      console.log(e.key);
      this.handleSnakeDirection(e.key);
    });
  }
  componentDidMount() {
    const makeBoardPromise = new Promise((s, r) => {
      this.makeBoard();
      s();
    });
    // make sure makeBoard is finish, then makeBorder/Food /start snake move
    makeBoardPromise.then(() => {
      this.makeBorder();
      this.makeFood();
      this.makeSnake();
      setTimeout(() => this.snakeMove(), this.state.speed);
    });
  }

  makeBoard() {
    var board = [];
    let counter = 1;
    for (let row = 0; row < this.state.boardRowSize; row++) {
      const currentRow = [];
      for (let col = 0; col < this.state.boardColSize; col++) {
        currentRow.push(counter++);
      }
      board.push(currentRow);
    }
    console.log(board);
    this.setState({
      ...this.state,
      board: board,
    });
  }

  makeBorder() {
    var border = new Set();
    var board = this.state.board;
    board[0].forEach((e) => border.add(e)); // first row of board
    board[board.length - 1].forEach((e) => border.add(e)); // last row of board
    let maxValue = (this.state.boardRowSize - 1) * this.state.boardColSize;
    let minValue = this.state.boardColSize + 1;
    // first col and last col of board
    for (let i = minValue; i < maxValue + 1; i++) {
      if (i % this.state.boardColSize <= 1) {
        border.add(i);
      }
    }
    console.log(border);
    this.setState({
      ...this.state,
      border: border,
    });
  }

  makeFood() {
    var nextFood = 0;
    let maxValue = (this.state.boardRowSize - 1) * this.state.boardColSize;
    let minValue = this.state.boardColSize + 1;
    while (true) {
      nextFood = Math.floor(
        Math.random() * (maxValue - minValue + 1) + minValue
      );
      if (
        this.state.snake.includes(nextFood) ||
        this.state.food === nextFood ||
        this.state.border.has(nextFood)
      ) {
        continue;
      }
      break;
    }
    // chance of make poison food
    var poisonFood = 0;
    if (Math.random() < 0.3) {
      poisonFood = nextFood;
    }
    this.setState({
      ...this.state,
      food: nextFood,
      poisonFood: poisonFood,
    });
    console.log(this.state.food);
    console.log(this.state.poisonFood);
  }

  makeSnake() {
    var snake = [];
    var startRow = Math.floor(this.state.boardRowSize / 4) + 1;
    var startValue = startRow * this.state.boardColSize + 2;
    snake.push(startValue);
    snake.push(startValue + 1);
    snake.push(startValue + 2);
    var head = snake[snake.length - 1];
    this.setState({
      ...this.state,
      snake: snake,
      snakeHead: head,
    });
  }

  snakeMove() {
    var snake = this.state.snake;
    var head = snake[snake.length - 1];
    var D = this.state.snakeDirection;
    var nextHead;
    if (D === "R") {
      nextHead = head + 1;
    }
    if (D === "L") {
      nextHead = head - 1;
    }
    if (D === "U") {
      nextHead = head - this.state.boardColSize;
    }
    if (D === "D") {
      nextHead = head + this.state.boardColSize;
    }

    var score = this.state.score;
    var speed = this.state.speed;
    var isPoison = false;
    if (this.state.food === nextHead) {
      if (this.state.poisonFood === nextHead) {
        isPoison = true;
        score += 2;
      }
      this.makeFood();
      score++;
      if (speed > 40) {
        speed = Math.floor((speed * 90) / 100);
      }
    } else {
      snake.shift();
    }
    // handle dead
    if (
      this.state.border.has(nextHead) ||
      this.state.snake.includes(nextHead)
    ) {
      console.log("dead");
    } else {
      setTimeout(() => this.snakeMove(), speed);
    }
    snake.push(nextHead);
    this.setState({
      ...this.state,
      snake: snake,
      snakeHead: nextHead,
      score: score,
      speed: speed,
    });
    if (isPoison) {
      this.reverseSnake();
    }
  }

  handleSnakeDirection(key) {
    var D = this.state.snakeDirection;
    var CD = this.currentSnakeDirection();
    if (key === "ArrowRight" && CD !== "L") {
      D = "R";
    }
    if (key === "ArrowLeft" && CD !== "R") {
      D = "L";
    }
    if (key === "ArrowUp" && CD !== "D") {
      D = "U";
    }
    if (key === "ArrowDown" && CD !== "U") {
      D = "D";
    }
    this.setState({
      ...this.state,
      snakeDirection: D,
    });
  }

  currentSnakeDirection() {
    var D = "";
    var snake = this.state.snake;
    var head = snake[snake.length - 1];
    var body = snake[snake.length - 2];
    if (head - body === 1) {
      D = "R";
    }
    if (head - body === -1) {
      D = "L";
    }
    if (head - body === this.state.boardColSize) {
      D = "D";
    }
    if (head - body === -this.state.boardColSize) {
      D = "U";
    }
    return D;
  }

  reverseSnake() {
    var snake = this.state.snake.reverse();
    var D = this.currentSnakeDirection();
    this.setState({
      ...this.state,
      snake: snake,
      snakeDirection: D,
    });
  }

  render() {
    var board = this.state.board;
    return (
      <div>
        <h2>SCORE : {this.state.score}</h2>
        {board.map((row, rowIdx) => (
          <div key={rowIdx} className="row">
            {row.map((cell, cellIdx) => (
              <div
                key={cellIdx}
                className={`cell ${
                  this.state.snake.includes(cell) ? "snake-cell" : ""
                } ${this.state.border.has(cell) ? "border-cell" : ""} ${
                  this.state.food === cell ? "food-cell" : ""
                } ${this.state.snakeHead === cell ? "snakeHead-cell" : ""}
                ${this.state.poisonFood === cell ? "poisonFood-cell" : ""}`}
              ></div>
            ))}
          </div>
        ))}
      </div>
    );
  }
}

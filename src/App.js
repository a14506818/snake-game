import "./App.css";
import Board from "./Board/Board2";
import React, { Component } from "react";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isRenderBoard: true,
    };
    document.addEventListener("keydown", (e) => {
      if (e.key === "r") {
        this.reloadGame();
      }
    });
  }
  reloadGame() {
    const reloadPromise = new Promise((s, r) => {
      this.setState({
        isRenderBoard: !this.state.isRenderBoard,
      });
      s();
    });
    reloadPromise.then(() => {
      this.setState({
        isRenderBoard: !this.state.isRenderBoard,
      });
    });
  }
  render() {
    return (
      <div className="App">
        {this.state.isRenderBoard ? <Board></Board> : ""}
        <button type="button" className="btn" onClick={() => this.reloadGame()}>
          Press "R" to Restart
        </button>
      </div>
    );
  }
}

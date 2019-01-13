import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
      return (
        <button className="square" onClick={props.onClick}>
          {props.value}
        </button> 
      );
  }
  
  class Board extends React.Component {
    renderSquare(i) {
      return <Square value={this.props.squares[i]} onClick={() => this.props.onClick(i)} />;
    }
    
    render() {
      return (
        <div>
            <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }
  
  class Game extends React.Component {
      constructor(props) {
            super(props);
            this.state = {
                history: [{
                    squares: Array(9).fill(null)
                }],
                xIsNext:true,
                stepNumber: 0
            };
      }
      handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber+1);
        const current = history[history.length-1];
        const sq = current.squares.slice();
        if(calcWinner(sq) || sq[i]) {
            return;
        }
        sq[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: sq
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        });
    }
    jumpTo(step) {
        this.setState({
          stepNumber: step,
          xIsNext: (step % 2) === 0,
        });
      }
    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const status = calcWinner(current.squares) ? 
        'Winner is '+calcWinner(current.squares) :
        'Next player: '+(this.state.xIsNext ? 'X' : 'O');

        const moves = history.map((step, move) => {
            const desc = move ? 'Go to move '+move : 'Go to start';
            return (
                <li>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });
   
      return (
        <div className="game">
          <div className="game-board">
            <Board squares={current.squares} onClick={(i) => this.handleClick(i)}/>
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );

  function calcWinner(s) {
      const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
      ];
      for(let i = 0; i < lines.length; i++) {
          const [a, b, c] = lines[i];
          if(s[a] === s[b] && s[a] === s[c] && s[a]) {
              return s[a];
          }
      }
      return null;
  }
  
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
      return (
        <button className={props.winnerClass} onClick={props.onClick1}>
          {props.value}
        </button> 
      );
  }
  
  class Board extends React.Component {
    renderSquare(i) {
      var myClass2 = 'square';
      if(this.props.winnerRow[0] === i || this.props.winnerRow[1] === i || this.props.winnerRow[2] === i) {
        myClass2 = 'winner-square'
      }
      return <Square value={this.props.squares[i]} winnerClass={myClass2} onClick1={() => this.props.onClick(i)} />;
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
                stepNumber: 0,
                currentPosition: null,
                historyPos: [0]
            };
      }
      handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber+1);
        const historyPos1 = this.state.historyPos.slice(0, this.state.stepNumber+1);
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
            xIsNext: !this.state.xIsNext,
            currentPosition: i,
            historyPos: historyPos1.concat([i])
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
        'Winner is '+calcWinner(current.squares)['player1'] : (this.state.stepNumber === 9 ? 'Its a Draw' : 'Next player: '+(this.state.xIsNext ? 'X' : 'O'));
        
        const className1 = 'button-highlight';


        const moves = history.map((step, move) => {
            const desc = move ? 'Go to move '+move+' [row: '+(Math.floor(this.state.historyPos[move]/3)+1)+' col: '+((this.state.historyPos[move]%3)+1)+']' : 'Go to start';
            const myClass = this.state.stepNumber === move ? className1 : '';
            return (
                <li>
                    <button className={myClass} onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });
      let myWinnerRow = [];
      if(calcWinner(current.squares)) {
          myWinnerRow = calcWinner(current.squares)['winIndex'];
      }
      return (
        <div className="game">
          <div className="game-board">
            <Board squares={current.squares} winnerRow={myWinnerRow} onClick={(i) => this.handleClick(i)}/>
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
              return {
                      player1: s[a],
                      winIndex: lines[i]
                     }; 
          }
      }
      return null;
  }
  
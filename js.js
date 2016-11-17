
class Square extends React.Component {
  render() {
    return (
      <button className={'square ' + (this.props.winningLine.indexOf(this.props.index) > -1 ? 'red' : '')} onClick={() => this.props.onClick() }>
        {this.props.value}
        
      </button>
    );
  }
}

class Board extends React.Component {
  
  render() {
    const size= this.props.width;
    var columns = [];
    for (var i=0; i<size; i++) {
      columns.push(i)
    };
    
     const board =  columns.map((columnNumber, index) => {
       const boardRows = columns.map((rowNumber) => {
          const i = (columnNumber * size) + rowNumber;
          return (
                        <Square key={i} index={i} winningLine={this.props.winningLine} value={this.props.squares[i]} onClick={() => this.props.onClick(i)} />
          )
       })
       
       return (
                    <div key={'column'+index} className="board-row">
                        {boardRows}
                    </div>
                )
     })


     return  <div>{ board }</div>
        
    
   
  }
}

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      history: [{
        squares :  Array(9).fill(null)
      }],
      xIsNext: true,
      currStep : 0,
      isDesc : false
    };
  }
  jumpTo(step) {
    this.setState({
      currStep : step,
      xIsNext: (step % 2) ? false : true,
    })
  }
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.currStep + 1);
    const current = history[this.state.currStep];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history : history.concat([{squares : squares}]),
      xIsNext : !this.state.xIsNext,
      currStep : history.length
    });
  }
  handleReverse() {
    this.setState({
      isDesc : !this.state.isDesc
    });
  }
  render() {
    const history = this.state.history.slice(0, this.state.currStep + 1);
    const current = history[this.state.currStep];
    const winnerObject = calculateWinner(current.squares);
    let winningLine = [];
    let status;
    if (winnerObject) {
      status = 'Winner: ' + winnerObject.winner;
      winningLine = winnerObject.winningLine;
    } else if (this.state.currStep == 9) {
      status = "Game Over."
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    
    
    const moves =  history.map((step, index) => {
    const description = index ?
      'Move #' + index :
      'Game start';
      return (<li className = { index == this.state.currStep ? 'bold' : ''} key={index}>
        <a href="#" onClick={() => this.jumpTo(index)}>{description}</a>
      </li>);
    
    });
    
    
    return (
      <div className="game">
        <div className="game-board">
          <Board
            width = {this.props.width}
            squares = {current.squares} 
            winningLine = {winningLine}
            onClick={(i) => this.handleClick(i) }
            />
        </div>
        <div className="game-info">
          <div className="status">{status}</div>
         
          <span>Reversed:</span>
        <label className="switch">
          <input checked={this.state.isDesc} onChange={() => this.handleReverse()} type="checkbox" />
          <div className="slider round"></div>
        </label>
          
          
          <ol>{this.state.isDesc ? moves.reverse() : moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game width="3" />,
  document.getElementById('container')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {winner: squares[a], winningLine : lines[i]};
    }
  }
  return null;
}

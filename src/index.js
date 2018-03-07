import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

/// Example of a functional component
function Square(props) {
    const thisIsWinnerSquare = props.isWinnerSquare
    // console.log(thisIsWinnerSquare)
    if (thisIsWinnerSquare === true) {
        return (
            <button className="square" onClick={props.onClick}>
                <strong>{props.value}</strong>
            </button>
        );
    }

    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {

        const winnerLines = this.props.winnerLines
        let thisIsWinnerSquare = false
        if (this.props.winnerLines) {
            if (i === winnerLines[0] || i === winnerLines[1] || i === winnerLines[2])
                thisIsWinnerSquare = true
            //console.log(i)
            //console.log(winnerLines)
        }

        return (
            <Square
                key={i}
                isWinnerSquare={thisIsWinnerSquare}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    renderRow(i) {
        let hijos = []
        for (var j = 0; j < 3; j++) {//0,1,2
            //console.log((3* i)  + j)
            hijos[j] = this.renderSquare((3 * i) + j)
        }
        return (
            <div key={i} className="board-row">
                {hijos}
            </div>
        )
    }

    render() {
        // var padres = {}
        // var hijos = {}
        //
        // for (var i = 0; i < 3; i++) {//0,1,2
        //     padres[i] = <div className="board-row"></div>
        //     for (var j = 0; j < 3; j++) {//0,1,2
        //         //console.log((3* i)  + j)
        //         hijos[j] = this.renderSquare((3 * i) + j)
        //     }
        // }
        var gameRows = []
        for (let i = 0; i < 3; i++)
            gameRows[i] = this.renderRow(i)

        return (
            <div>
                {gameRows}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                columna: -1,
                fila: -1,

            }],
            stepNumber: 0,
            isInvertedOrder: false,
            xIsNext: true
        };
    }


    handleClick(i) {
        const columna = i % 3;
        const fila = parseInt(Math.floor(i / 3), 10)

        // console.log(`Columna${columna}`)
        // console.log(`Fila${fila}`)

        const history = this.state.history.slice(0, this.state.stepNumber + 1);///Slice crea una copia del array desde el indice 0 haste al fin-1

        const current = history[history.length - 1];

        const squares = current.squares.slice();


        if (calculateWinner(squares) || squares[i]) { /// SI YA HAY UN GANADOR O EL ELEMENTO squares[i] ya tiene un valor
            // console.log('winner or no more squares')
            // console.log(calculateWinner(squares))
            // console.log(squares[i])
            return;
        }

        squares[i] = this.state.xIsNext ? 'X' : 'O';

        this.setState({
            history: history.concat([{
                squares: squares,
                fila: fila,
                columna: columna,
            }]),
            winnerLines: null,
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }


    ///Cambia  a una vista del juego en un momento predeterminado
    jumpTo(step) {
        console.log(`Jumping to ${step}`)
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    handleReverseOrder() {
        const history = this.state.history;
        const invertedHistory = history.reverse()
        this.setState({
            history: invertedHistory,
            isInvertedOrder: !this.state.isInvertedOrder
        })
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const stepSelected = this.state.stepNumber;
        const winner = calculateWinner(current.squares);
        const isInvertedHistory = this.state.isInvertedOrder
        const totalSteps = history.length;
        // console.log('Renderizando juego')
        const moves = history.map((step, indexMove) => {
            // console.log(step)//
            // console.log(indexMove)
            let desc = ''
            let indexInverted = totalSteps - (indexMove + 1);
            // console.log('IndexInverted->' + indexInverted)
            if (isInvertedHistory) {
                desc = (indexMove === (totalSteps - 1)) ?///Si es indice = (totalMovimientos -1)
                    'Go to game start' :
                    'Go to move #' + indexInverted + `(${step.columna},${step.fila})`;
            } else {
                desc = indexMove ?///Si es indice 0
                    'Go to move #' + indexMove + `(${step.columna},${step.fila})` :
                    'Go to game start';
            }

            // if (isInvertedHistory) {
            //     console.log('Inverted')
            // } else {
            //     console.log('NOT INVERTED')
            // }

            if (stepSelected === indexMove) {
                // desc += 'Selected'
                return (
                    <li key={indexMove}>
                        <button onClick={() => this.jumpTo(indexMove)}><strong>{desc}</strong></button>
                    </li>
                );
            } else {
                // desc += 'Unselected'
                return (
                    <li key={indexMove}>
                        <button onClick={() => this.jumpTo(indexMove)}>{desc}</button>
                    </li>
                );
            }

        });

        let status;
        if (winner) {
            status = 'Winner: ' + (this.state.xIsNext ? 'Player O' : 'Player X');
        } else if (!winner && totalSteps == 10) {
            status = 'This game is a DRAW'
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares} winnerLines={winner}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
                <div className="game-info">
                    <button onClick={() => this.handleReverseOrder()}>Reverse</button>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game/>,
    document.getElementById('root')
);

///Calcula el ganador deacuerdo a una reglas
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
            return lines[i];
        }
    }
    return null;
}
  
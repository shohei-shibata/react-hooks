// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import React from 'react'
import {useLocalStorageState} from '../utils.js'

function Board({squares, onSelectSquare}) {
  function renderSquare(i) {
    return (
      <button className="square" onClick={() => onSelectSquare(i)}>
        {squares[i]}
      </button>
    )
  }
  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

function Game() {
  const emptySquares = Array(9).fill(null)
  const [squares, setSquares] = useLocalStorageState('tic-tac-toe', emptySquares)
  const [history, setHistory] = React.useState([squares])
  const [currentStep, setCurrentStep] = React.useState(0)

  const nextValue = calculateNextValue(squares)
  const winner = calculateWinner(squares)
  const status = calculateStatus(winner, squares, nextValue)

  function selectSquare(square) {
    if (winner || squares[square]) { return }
    const nextSquares = [...squares]
    nextSquares[square] = nextValue

    console.log(currentStep, history.slice(0,currentStep+1))
    setHistory([...history.slice(0, currentStep+1), nextSquares]) 
    setCurrentStep(currentStep+1)
    setSquares(nextSquares)
  }

  function goToStep(stepId) {
    console.log(`go to step ${stepId}`)
    setSquares(history[stepId])
    setCurrentStep(stepId)
  }

  function restart() {
    setSquares(emptySquares)
    setHistory([emptySquares])
    setCurrentStep(0)
  }

  const moves = history.map((item, index) => {
    const isCurrent = index === currentStep
    return (
      <li key={index}>
        <button 
          onClick={() => goToStep(index)}
          disabled={isCurrent}
        >{
          index === 0 ?
          "Go to game start" :
          `Go to move #${index}`
        }</button>
      </li>
    )
  })

  return (
    <div className="game">
      <div className="game-board">
        <Board squares={squares} onSelectSquare={selectSquare}/>
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div>
        <div className="status">{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  const xSquaresCount = squares.filter(r => r === 'X').length
  const oSquaresCount = squares.filter(r => r === 'O').length
  return oSquaresCount === xSquaresCount ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
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
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App

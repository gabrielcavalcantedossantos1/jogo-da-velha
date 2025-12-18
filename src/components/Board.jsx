import { useEffect, useState } from "react"
import Square from "./Square"

const Board = () => {
  // ======================
  // ESTADOS
  // ======================
  const [squares, setSquares] = useState(Array(9).fill(null))
  const [isPlayerTurn, setIsPlayerTurn] = useState(true)
  const [difficulty, setDifficulty] = useState("medium")
  const [aiThinking, setAiThinking] = useState(false)

  const winner = calculateWinner(squares)
  const draw = squares.every(square => square !== null)

  // ======================
  // CLICK DO JOGADOR
  // ======================
  const handleClick = (index) => {
    if (!isPlayerTurn || squares[index] || winner) return

    const newSquares = [...squares]
    newSquares[index] = "X"
    setSquares(newSquares)
    setIsPlayerTurn(false)
  }

  // ======================
  // IA
  // ======================
  useEffect(() => {
    if (!isPlayerTurn && !winner && !draw) {
      setAiThinking(true)

      setTimeout(() => {
        let move

        if (difficulty === "easy") {
          move = aiEasyMove(squares)
        } else if (difficulty === "medium") {
          move = aiMediumMove(squares)
        } else {
          move = aiHardMove(squares)
        }

        if (move !== undefined) {
          const newSquares = [...squares]
          newSquares[move] = "O"
          setSquares(newSquares)
        }

        setAiThinking(false)
        setIsPlayerTurn(true)
      }, 600)
    }
  }, [isPlayerTurn, squares, difficulty, winner, draw])

  // ======================
  // RESET
  // ======================
  const resetGame = () => {
    setSquares(Array(9).fill(null))
    setIsPlayerTurn(true)
    setAiThinking(false)
  }

  return (
    <div className="jogo">
      {/* DIFICULDADE */}
      <div className="status">
        <label>Dificuldade: </label>
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <option value="easy">Fácil</option>
          <option value="medium">Médio</option>
          <option value="hard">Difícil</option>
        </select>
      </div>

      {/* STATUS */}
      <div className="status-jogo">
        {winner && <span className="winner">Vencedor: {winner}</span>}

        {!winner && draw && <span className="draw">Deu velha 😐</span>}

        {!winner && !draw && (
          <span className="status">
            {aiThinking ? "IA está pensando..." : "Sua vez de jogar"}
          </span>
        )}
      </div>

      {/* TABULEIRO */}
      <div className="board-row">
        {squares.map((value, index) => (
          <Square
            key={index}
            value={value}
            onClick={() => handleClick(index)}
          />
        ))}
      </div>

      <button className="reset-button" onClick={resetGame}>
        Reiniciar
      </button>
    </div>
  )
}

export default Board

// ======================
// VERIFICAR VENCEDOR
// ======================
const calculateWinner = (squares) => {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ]

  for (let [a,b,c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

// ======================
// IA FÁCIL
// ======================
const aiEasyMove = (squares) => {
  const empty = squares
    .map((v, i) => (v === null ? i : null))
    .filter(v => v !== null)

  return empty[Math.floor(Math.random() * empty.length)]
}

// ======================
// IA MÉDIA
// ======================
const aiMediumMove = (squares) => {
  const empty = squares
    .map((v, i) => (v === null ? i : null))
    .filter(v => v !== null)

  // ganhar
  for (let i of empty) {
    const test = [...squares]
    test[i] = "O"
    if (calculateWinner(test) === "O") return i
  }

  // bloquear
  for (let i of empty) {
    const test = [...squares]
    test[i] = "X"
    if (calculateWinner(test) === "X") return i
  }

  // centro
  if (empty.includes(4)) return 4

  return empty[Math.floor(Math.random() * empty.length)]
}

// ======================
// IA DIFÍCIL (MINIMAX)
// ======================
const aiHardMove = (squares) => {
  let bestScore = -Infinity
  let move

  squares.forEach((cell, i) => {
    if (cell === null) {
      squares[i] = "O"
      const score = minimax(squares, 0, false)
      squares[i] = null

      if (score > bestScore) {
        bestScore = score
        move = i
      }
    }
  })

  return move
}

const minimax = (board, depth, isMax) => {
  const winner = calculateWinner(board)

  if (winner === "O") return 10 - depth
  if (winner === "X") return depth - 10
  if (board.every(s => s !== null)) return 0

  if (isMax) {
    let best = -Infinity
    board.forEach((cell, i) => {
      if (cell === null) {
        board[i] = "O"
        best = Math.max(best, minimax(board, depth + 1, false))
        board[i] = null
      }
    })
    return best
  } else {
    let best = Infinity
    board.forEach((cell, i) => {
      if (cell === null) {
        board[i] = "X"
        best = Math.min(best, minimax(board, depth + 1, true))
        board[i] = null
      }
    })
    return best
  }
}

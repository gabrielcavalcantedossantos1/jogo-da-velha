import React, { useEffect, useState } from 'react'
import Square from './Square'

const Board = () => {
    const [square, setSquare] = useState(Array(9).fill(null))
    const [isNext, setIsNext] = useState(true)
    const [aiIsThinking, setAiIsThinking] = useState(false)

    const winner = calculateWinner(square)
    const draw = isDraw(square)

    const handleClick = (i) => {
        if (square[i] || winner || draw || !isNext) return

        const newSquare = square.slice()
        newSquare[i] = "X"

        setSquare(newSquare)
        setIsNext(false)
    }

    const resetGame = () => {
        setSquare(Array(9).fill(null))
        setIsNext(true)
    }

    useEffect(() => {
        if (!isNext && !winner && !draw) {
            setAiIsThinking(true)

            setTimeout(() => {
                aiMove(square, setSquare, setIsNext)
                setAiIsThinking(false)
            }, 800)
        }
    }, [isNext, square, winner, draw])

    return (
        <div>
            <div className="status">
                <div className="status-jogo">
                    {winner ? (
                        <p className="winner">O vencedor é {winner}!</p>
                    ) : draw ? (
                        <p className="draw">Deu velha 😐</p>
                    ) : aiIsThinking ? (
                        <p>IA está pensando...</p>
                    ) : (
                        <p>Próximo a jogar: X</p>
                    )}
                </div>

                <div className="jogo">
                    <div className="board-row">
                        <Square value={square[0]} onClick={() => handleClick(0)} />
                        <Square value={square[1]} onClick={() => handleClick(1)} />
                        <Square value={square[2]} onClick={() => handleClick(2)} />
                    </div>
                    <div className="board-row">
                        <Square value={square[3]} onClick={() => handleClick(3)} />
                        <Square value={square[4]} onClick={() => handleClick(4)} />
                        <Square value={square[5]} onClick={() => handleClick(5)} />
                    </div>
                    <div className="board-row">
                        <Square value={square[6]} onClick={() => handleClick(6)} />
                        <Square value={square[7]} onClick={() => handleClick(7)} />
                        <Square value={square[8]} onClick={() => handleClick(8)} />
                    </div>

                    <button className="reset-button" onClick={resetGame}>
                        Reiniciar Jogo
                    </button>
                </div>
            </div>
        </div>
    )
}



const calculateWinner = (squares) => {
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

    for (let [a, b, c] of lines) {
        if (
            squares[a] &&
            squares[a] === squares[b] &&
            squares[a] === squares[c]
        ) {
            return squares[a]
        }
    }

    return null
}

const isDraw = (squares) => {
    return squares.every(square => square !== null)
}

const checkWinner = (squares, player) => {
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

    for (let [a, b, c] of lines) {
        if (
            squares[a] === player &&
            squares[b] === player &&
            squares[c] === player
        ) {
            return true
        }
    }

    return false
}

const aiMove = (squares, setSquare, setIsNext) => {
    const emptySquares = squares
        .map((value, index) => (value === null ? index : null))
        .filter(index => index !== null)

    let move = null

    
    for (let i of emptySquares) {
        const testSquares = squares.slice()
        testSquares[i] = "O"

        if (checkWinner(testSquares, "O")) {
            move = i
            break
        }
    }

    
    if (move === null) {
        for (let i of emptySquares) {
            const testSquares = squares.slice()
            testSquares[i] = "X"

            if (checkWinner(testSquares, "X")) {
                move = i
                break
            }
        }
    }

    
    if (move === null && emptySquares.includes(4)) {
        move = 4
    }

    
    if (move === null) {
        move =
            emptySquares[Math.floor(Math.random() * emptySquares.length)]
    }

    const newSquare = squares.slice()
    newSquare[move] = "O"

    setSquare(newSquare)
    setIsNext(true)
}

export default Board

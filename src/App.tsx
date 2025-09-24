import { useState } from "react";
import Board from "./Board.tsx";
import { initialGameState, makeMove, calculateWinner } from "./go.ts"

export default function App() {
  const [gameState, setGameState] = useState(initialGameState);

  const handleCellClick = (row: number, col: number) => {
    if (gameState.board[row][col] !== null || (gameState.xSurrender && gameState.oSurrender)) return
    setGameState(makeMove(gameState, row, col))
  };

  const handlePass = () => {
    // setGameState(prevGameState => ({...prevGameState, `[prevGameState.currentPlayer]Surrender`: winner}))
    const winner = calculateWinner(gameState)
    setGameState(prevGameState => ({...prevGameState, winner: winner}))
  }

  return (
    <div className="p-4">
      <Board board={gameState.board} onCellClick={handleCellClick} />
      <button onClick={handlePass}>Pass</button>
      {(gameState.xSurrender && gameState.oSurrender) && <div></div>}
    </div>
  );
}

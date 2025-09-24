import { useState } from "react";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query"

import Board from "./Board.tsx";
import { initialGameState, makeMove, calculateWinner } from "./go.ts"

const queryClient = new QueryClient()

export default function App() {
  const [gameState, setGameState] = useState(initialGameState);

  const handleCellClick = (row: number, col: number) => {
    if (gameState.board[row][col] !== null || (gameState.pass["x"] && gameState.pass["o"])) return
    setGameState(makeMove(gameState, row, col))
  };

  const handlePass = () => {
    const newGameState = calculateWinner(gameState)
    setGameState(newGameState)
  }

  return (
    <div className="p-4">
      <Board board={gameState.board} onCellClick={handleCellClick} />
      <button onClick={handlePass}>Pass</button>
      {(gameState.pass["x"] && gameState.pass["o"] && gameState.winner) && <div>{gameState.winner} Wins!</div>}
    </div>
  );
}

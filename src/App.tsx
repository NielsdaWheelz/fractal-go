import { useState } from "react";
import Board from "./Board.tsx";
import { initialGameState, makeMove } from "./go.ts"

export default function App() {
  const [gameState, setGameState] = useState(initialGameState);

  const handleCellClick = (row: number, col: number) => {
    console.log("clicked", row, col);
    if (gameState.board[row][col] !== null) return
    setGameState(makeMove(gameState, row, col))
  };

  return (
    <div className="p-4">
      <Board board={gameState.board} onCellClick={handleCellClick} />
    </div>
  );
}

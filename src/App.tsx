import { useState } from "react";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query"

import Board from "./Board.tsx";
import { initialGameState, makeMove, calculateWinner } from "./go.ts"

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Page />
    </QueryClientProvider>
  );
}

const Page = () => {

  const { isPending, error, data } = useQuery({
    queryKey: ['gameData'],
    queryFn: () =>
      fetch("/game").then((res) =>
      res.json(),
      ),
  })

  if (isPending) return "Loading..."

  if (error) return "Error..." + error.message

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
      <Board board={data.board} onCellClick={handleCellClick} />
      <button onClick={handlePass}>Pass</button>
      {(data.pass["x"] && data.pass["o"] && data.winner) && <div>{data.winner} Wins!</div>}
    </div>
  )
}

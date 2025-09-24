import { QueryClient, QueryClientProvider, useQuery, useMutation } from "@tanstack/react-query"
import Board from "./Board.tsx";
import { initialGameState, makeMove, calculateWinner } from "./go.ts"

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Game />
    </QueryClientProvider>
  );
}

const Game = () => {

  const getGame = async (id) => {
    try {
      const response = await fetch(`/game/${id}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error", error)
      throw error
    }

  }

  const { isPending, error, data } = useQuery({
    queryKey: ['gameData'],
    queryFn: () =>
      getGame(0),
  })

  // const mutation = useMutation({
  //   mutationFn: fetch("/move", req).then((res) =>
  //   res.json()),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ['gameData'] })
  //   }
  // })

  if (isPending) return "Loading..."

  if (error) return "Error..." + error.message

  const handleCellClick = (row: number, col: number) => {
    // mutation.mutate({
    //   id: data.id,
    //   row: row,
    //   col: col
    // })
  };

  const handlePass = () => {
    // const newGameState = calculateWinner(gameState)
    // setGameState(newGameState)
  }
  return (
    <div className="p-4">
      <Board board={data.board} onCellClick={handleCellClick} />
      <button onClick={handlePass}>Pass</button>
      {(data.pass["x"] && data.pass["o"] && data.winner) && <div>{data.winner} Wins!</div>}
    </div>
  )
}

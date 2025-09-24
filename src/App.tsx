import { initialGameState, makeMove, calculateWinner } from "./go.ts"
import { useQuery, useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { getGames, getGame, createGame, postMove } from "./api.ts"
import Game from "./Game.tsx"

export default function App(props: { queryClient }) {
  const [selectedGameId, setSelectedGameId] = useState(null)

  const getGameQuery = useQuery({
    queryKey: ['game', selectedGameId],
    queryFn: () =>
      getGame(selectedGameId), enabled: !!selectedGameId,
  })

  const getGamesQuery = useQuery({
    queryKey: ['games'],
    queryFn: () =>
      getGames(),
  })

  const moveMutation = useMutation({
    mutationFn: ({ id, row, col }) => postMove(id, row, col),
    onSuccess: () => {
      props.queryClient.invalidateQueries({ queryKey: ['game', selectedGameId] })
    }
  })

  const createGameMutation = useMutation({
    mutationFn: () => createGame(),
    onSuccess: (data) => {
      props.queryClient.invalidateQueries({ queryKey: ['games'] })
      setSelectedGameId(data.id)
    }
  })

  const handleCreateGame = () => {
    const newGame = createGameMutation.mutate()
    setSelectedGameId(newGame.id)
  }

  const handleOpenGame = (id) => {
    setSelectedGameId(id)
  }

  const games = getGamesQuery.data || []
  const gameElements = games.map(game => (
      <li key={game.id} onClick={ () => handleOpenGame(game.id) }>id: { game.id }, turn: { game.currentPlayer }, Winner: { game.winner || "undecided" }</li>
  ))

  if (getGamesQuery.isLoading) return "Loading..."
  if (!getGamesQuery.data) return "No games found"

  if (getGameQuery.error) return "Error..." + getGameQuery.error.message
  if (getGamesQuery.error) return "Error..." + getGamesQuery.error.message

  return (
    selectedGameId ? (
      <Game data={getGameQuery.data} moveMutation={ moveMutation } />
    ) : 
    <>
      <ul>
          { gameElements }
      </ul>
      <button onClick={handleCreateGame}>Create New Game</button>
    </>
  )
}

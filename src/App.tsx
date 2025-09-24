import { useState } from "react"
import { useQuery, useMutation } from "@tanstack/react-query"
import { getGames, getGame, createGame, postMove } from "./api.ts"
import List from "./List.tsx"
import Game from "./Game.tsx"
// import { initialGameState, makeMove, calculateWinner } from "./go.ts"

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
    console.log("handleCreateGame")
    createGameMutation.mutate()
  }

  const handleOpenGame = (id) => {
    console.log("handleOpenGame", id)
    setSelectedGameId(id)
  }
  if (getGamesQuery.isLoading) return "Loading..."
  if (getGamesQuery.error) return "Error..." + getGamesQuery.error.message
  if (!getGamesQuery.data) return "No games found"

  if (selectedGameId) {
    if (getGameQuery.isLoading) return "Loading..."
    if (getGameQuery.error) return "Error..." + getGameQuery.error.message
    if (!getGameQuery.data) return "Game not found"
  
    return <Game data={getGameQuery.data} moveMutation={ moveMutation } setFunc={ setSelectedGameId } />
  }

  return (
    <List data={getGamesQuery.data} handleOpenGame={ handleOpenGame } handleCreateGame={ handleCreateGame }/>
  )
}

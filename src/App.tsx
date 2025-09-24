import { useState } from "react"
import { useQuery, useMutation } from "@tanstack/react-query"
import { getGames, getGame, createGame, postMove, postPass } from "./api.ts"
import List from "./List.tsx"
import Game from "./Game.tsx"
// import { initialGameState, makeMove, calculateWinner } from "./go.ts"

export default function App(props: { queryClient }) {
  const [selectedGame, setSelectedGame] = useState(null)

  const getGameQuery = useQuery({
    queryKey: ['game', selectedGame],
    queryFn: () =>
      getGame(selectedGame.id), enabled: !!selectedGame,
  })

  const getGamesQuery = useQuery({
    queryKey: ['games'],
    queryFn: () =>
      getGames(),
  })

  const moveMutation = useMutation({
    mutationFn: ({ id, row, col }) => postMove(id, row, col),
    onSuccess: () => {
      props.queryClient.invalidateQueries({ queryKey: ['game', selectedGame] })
    }
  })

  const passMutation = useMutation({
    mutationFn: ( id ) => postPass(id),
    onSuccess: () => {
      props.queryClient.invalidateQueries({ queryKey: ['game', selectedGame] })
    }
  })

  const createGameMutation = useMutation({
    mutationFn: () => createGame(),
    onSuccess: (data) => {
      props.queryClient.invalidateQueries({ queryKey: ['games'] })
      setSelectedGame(data)
    }
  })

  const handleCreateGame = () => {
    createGameMutation.mutate()
  }

  const handleOpenGame = (game) => {
    setSelectedGame(game)
  }

  if (getGamesQuery.isLoading) return "Loading..."
  if (getGamesQuery.error) return "Error..." + getGamesQuery.error.message
  if (!getGamesQuery.data) return "No games found"

  if (selectedGame) {
    if (getGameQuery.isLoading) return "Loading..."
    if (getGameQuery.error) return "Error..." + getGameQuery.error.message
    if (!getGameQuery.data) return "Game not found"
  
    return <Game data={selectedGame} moveMutation={ moveMutation } passMutation={ passMutation } setFunc={ setSelectedGame } />
  }

  return (
    <List data={getGamesQuery.data} handleOpenGame={ handleOpenGame } handleCreateGame={ handleCreateGame }/>
  )
}

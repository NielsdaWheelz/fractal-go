import { useState } from "react"
import { useQuery, useMutation } from "@tanstack/react-query"
import { getGames, getGame, createGame, postMove, postPass } from "./api.ts"
import List from "./List"
import Game from "./Game"
import type { GameState } from "./types.ts"

export default function App(props: { queryClient: any }) {
  const [selectedGame, setSelectedGame] = useState<GameState | null>(null)
  const [boardSize, setBoardSize] = useState<number>(5)
  const sizes = [5, 9, 13, 19]

  const sizeSwitchStyle = (size: number) => `w-[20%] text-sm text-white border-gray-600 py-0.5 rounded-md m-0.5 ${boardSize === size ? "bg-gray-900 hover:bg-gray-700" : "bg-gray-400 hover:bg-gray-600" }`

  const getGameQuery = useQuery({
    queryKey: ['game', selectedGame?.id],
    queryFn: () =>
      getGame(selectedGame?.id as number), enabled: !!selectedGame,
  })

  const getGamesQuery = useQuery({
    queryKey: ['games'],
    queryFn: () =>
      getGames(),
  })

  const moveMutation = useMutation({
    mutationFn: ({ id, row, col }: { id: number; row: number; col: number }) => postMove(id, row, col),
    onSuccess: () => {
      props.queryClient.invalidateQueries({ queryKey: ['game', selectedGame?.id] })
    }
  })

  const passMutation = useMutation({
    mutationFn: ({ id }: { id: number }) => postPass(id),
    onSuccess: () => {
      props.queryClient.invalidateQueries({ queryKey: ['game', selectedGame?.id] })
    }
  })

  const createGameMutation = useMutation({
    mutationFn: (size: number) => createGame(size),
    onSuccess: (data) => {
      props.queryClient.invalidateQueries({ queryKey: ['games'] })
      setSelectedGame(data)
    }
  })

  const handleCreateGame = () => {
    createGameMutation.mutate(boardSize)
  }

  const handleOpenGame = (game: GameState) => {
    setSelectedGame(game)
  }

  const renderLoading = (text: string) => (
    <div className=""><div className="">{ text }</div></div>
  )

  const listLoading = getGamesQuery.isLoading
  const listError = getGamesQuery.error
  const listData = getGamesQuery.data

  const gameLoading = selectedGame && getGameQuery.isLoading
  const gameError = selectedGame && (getGameQuery.error)
  const gameData = selectedGame && getGameQuery.data

  return (
    <>
    <header className="bg-gray-100 rounded-md p-6 m-2">
      {selectedGame ? (
        <div className="flex flex-row justify-between">
          <button className="bg-blue-500 text-sm border-blue-700 text-white p-1 rounded-md hover:bg-blue-700" onClick={() => setSelectedGame(null)}>Go Back</button>
          <div className="text-xl font-bold">{ gameData?.currentPlayer }'s Turn</div>
          <div className="">Game #{gameData?.id}</div>
        </div>      
      ) : (
        <div className="flex flex-row justify-between">
          <div className="text-2xl font-bold align-middle justify-center">Get Go-ing</div>
          <div className="flex flex-col">
            <button className="bg-green-600 text-white hover:bg-green-800 rounded-md border-1 border-green-800 py-1 px-2" onClick={ handleCreateGame }>Create New Game</button>
            <div className="flex flex-row justify-center">{sizes.map((size) => (
              <button
                key={size}
                onClick={() => setBoardSize(size)}
                className={ sizeSwitchStyle(size) }>
                {size}
              </button>
            ))}</div>
          </div>
        </div>
      )}
    </header>
    <main>
      <div className="">
        {!selectedGame && (
          <>
            {listLoading && renderLoading('Loading...')}
            {listError && renderLoading(`Error... ${listError.message}`)}
            {!listLoading && !listError && !listData && renderLoading('No games found')}
            {!listLoading && !listError && listData && (
              <List data={ listData } handleOpenGame={ handleOpenGame } />
            )}
          </>
        )}

        {selectedGame && (
          <>
            {gameLoading && renderLoading('Loading...')}
            {gameError && renderLoading(`Error... ${gameError.message}`)}
            {!gameLoading && !gameError && !gameData && renderLoading('Game not found')}
            {!gameLoading && !gameError && gameData && (
              <Game data={ gameData } passMutation={ passMutation} moveMutation={ moveMutation } />
            )}
          </>
        )}
      </div>
    </main>
    </>
  )
}
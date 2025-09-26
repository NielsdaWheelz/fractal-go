import { useState, useEffect } from "react"
import { useGetGameQuery, useGetGamesQuery } from "./queries"
import { useCreateGameMutation, usePassMutation } from "./mutations"
import { useQueryClient } from "@tanstack/react-query"
import List from "./List"
import Board from "./Board"
import Stone from "./Stone"
import Trash from "./Trash"
import type { GameState } from "./types.ts"
import { io } from "socket.io-client"

// set up socket connection, turns on
const socket = io('http://localhost:4000/');
socket.on("connect", () => {
  console.log('connected: ' + socket.id);
})

export default function App() {
  const queryClient = useQueryClient()
  const [selectedGame, setSelectedGame] = useState<GameState | null>(null)
  const [boardSize, setBoardSize] = useState<number>(5)
  const sizes = [5, 9, 13, 19]

  const sizeSwitchStyle = (size: number) => `w-[20%] text-sm text-white border-gray-600 p-0.5 rounded-md m-0.5 ${boardSize === size ? "bg-gray-900 hover:bg-gray-700" : "bg-gray-400 hover:bg-gray-600"}`

  const createGameMutation = useCreateGameMutation()
  const passMutation = usePassMutation()
  const gamesQuery = useGetGamesQuery()
  const gameId = selectedGame?.id
  const gameQuery = useGetGameQuery(gameId)

  // game updates, detects when queryClient changes
  useEffect(() => {
    const handleGamesUpdated = (games: GameState[]) => {
      queryClient.setQueryData(['games'], games)
    }

    const handleGameUpdated = (game: GameState) => {
      queryClient.setQueryData(['game', game.id], game)
    }

    socket.on('games:updated', handleGamesUpdated)
    socket.on('game:updated', handleGameUpdated)

    return () => {
      socket.off('games:updated', handleGamesUpdated)
      socket.off('game:updated', handleGameUpdated)
    }
  }, [queryClient])

  // detects user connection and which game user is joined to. changes when the active game (state) changes
  useEffect(() => {
    const id = selectedGame?.id

    if (id) {
      socket.emit('game:join', id)
    }

    const handleConnect = () => {
      if (selectedGame?.id) {
        socket.emit('game:join', id)
      }
    }
    socket.on('connect', handleConnect)

    return () => {
      if (id) {
        socket.emit('game:leave', id)
        socket.off('connect', handleConnect)
      }
    }
  }, [selectedGame?.id])

  const handleCreateGame = () => {
    createGameMutation.mutate(boardSize, {
      onSuccess: (data) => {
        setSelectedGame(data)
      }
    })
  }

  const handleOpenGame = (game: GameState) => {
    setSelectedGame(game)
  }

  const handlePass = () => {
    passMutation.mutate({
      id: gameData.id
    })
  }

  const renderLoading = (text: string) => (
    <div className="">{text}</div>
  )

  const listLoading = gamesQuery.isLoading
  const listError = gamesQuery.error as any
  const listData = gamesQuery.data

  const gameLoading = gameQuery.isLoading
  const gameError = gameQuery.error as any
  const gameData = gameQuery.data

  return (
    <>
      <div className="flex flex-col h-dvh">
        <header className="bg-gray-100 rounded-md p-6 m-2 flex-none">
          {selectedGame ? (
            <div className="flex flex-row justify-between">
              <button
                className="bg-blue-500 text-sm border-blue-700 text-white p-1 rounded-md hover:bg-blue-700"
                onClick={() => setSelectedGame(null)}
              >
                Go Back
              </button>
              <div className="text-xl font-bold h-10 flex items-center gap-2">
                {gameData ? (
                  <>
                    {gameData.winner ? (
                      <>
                        {gameData.winner === "x" && (
                          <>
                            <Stone colour="black" cursor={false} /> <span>won!</span>
                          </>
                        )}
                        {gameData.winner === "o" && (
                          <>
                            <Stone colour="white" cursor={false} /> <span>won!</span>
                          </>
                        )}
                        {gameData.winner === "draw" && (
                          <span>nobody wins</span>
                        )}
                      </>
                    ) : (
                      <>
                        {gameData.currentPlayer === "x" && (
                          <>
                            <span className="text-4xl">G</span><Stone colour="black" cursor={false} />
                          </>
                        )}
                        {gameData.currentPlayer === "o" && (
                          <>
                            <span className="text-4xl">G</span><Stone colour="white" cursor={false} />
                          </>
                        )}
                      </>
                    )}
                  </>
                ) : null}
              </div>
              <div className="">Game #{gameData?.id}</div>
            </div>
          ) : (
            <div className="flex flex-row justify-between">
              <div className="text-2xl font-bold align-middle justify-center">Get Go-ing</div>
              <div className="flex flex-col">
                <button className="bg-green-600 text-white hover:bg-green-800 rounded-md border-1 border-green-800 py-1 px-2" onClick={handleCreateGame}>Create New Game</button>
                <div className="flex flex-row justify-center">
                  {sizes.map((size) => (
                    <button key={size} onClick={() => setBoardSize(size)} className={sizeSwitchStyle(size)}>{size}</button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </header>
        {!selectedGame && (
          <>
            {listLoading && renderLoading('Loading...')}
            {listError && renderLoading(`Error... ${listError.message}`)}
            {!listLoading && !listError && !listData && renderLoading('No games found')}
            {!listLoading && !listError && listData && (
              <List data={listData} handleOpenGame={handleOpenGame} />
            )}
          </>
        )}

        {selectedGame && (
          <>
            {gameLoading && renderLoading('Loading...')}
            {gameError && renderLoading(`Error... ${gameError.message}`)}
            {!gameLoading && !gameError && !gameData && renderLoading('Game not found')}
            {!gameLoading && !gameError && gameData && (
              <Board game={gameData} />
            )}
          </>
        )}
        <footer className="flex-none self-center">
          {/* {selectedGame && <button onClick={handlePass}><Trash />Pass</button>} */}
          {selectedGame && <button className="bg-amber-300 hover:bg-amber-500 hover:border-amber-700 rounded-md px-4 py-1 mb-2" onClick={handlePass}>Pass</button>}
        </footer>
      </div>
    </>
  )
}
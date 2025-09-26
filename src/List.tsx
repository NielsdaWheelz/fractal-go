import type { GameState } from "./types.ts"

const List = (props: { data: GameState[]; handleOpenGame: (game: GameState) => void }) => {
  const games = props.data || []

  const gameElements = (
    games.map((game: GameState) => (
      <li key={game.id} className="bg-gray-200 border-gray-400 py-1 px-2 rounded-md hover:bg-gray-400">
        <button onClick={() => props.handleOpenGame(game)} className="w-full">
            <div className="flex flex-row justify-between">
              <div className="">Game #{game.id}</div>
              <div className="">
                {game.winner ? game.winner === "draw" ? `${game.winner}!` : `${game.winner} Won!` : `${game.currentPlayer}'s turn`}
              </div>
            </div>
        </button>
      </li>
    ))
  )

  return (
    <ul className="flex flex-col p-4 m-4 gap-2">
      { gameElements }
    </ul>
  )
}

export default List
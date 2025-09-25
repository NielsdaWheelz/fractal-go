import type { GameState } from "./types.ts"

const List = (props: { data: GameState[]; handleOpenGame: (game: GameState) => void }) => {
  const games = props.data || []

  return (
    <div className="">
      <ul className="">
        {games.map((game: GameState) => (
          <li key={game.id}>
            <button onClick={() => props.handleOpenGame(game)} className="">
              <div className="">
                <div className="">
                  <div className="">Game #{game.id}</div>
                  <span className="">
                    {game.winner ? `Winner: ${game.winner}` : `Turn: ${game.currentPlayer}`}
                  </span>
                </div>
                <div className="">
                </div>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default List
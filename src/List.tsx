import type { GameState } from "./types.ts"
import { calculateScores } from "./go.ts";
import Stone from "./Stone.tsx";

const List = (props: { data: GameState[]; handleOpenGame: (game: GameState) => void }) => {
  const games = props.data || []

  const gameElements = (
    games.map((game: GameState) => {
      const { xScore, oScore, leader, diff } = calculateScores(game)
      return (
        <li key={game.id} className="bg-gray-300/70 hover:bg-gray-400/80 rounded-md p-2 shadow-inner transition-colors">
          <button onClick={() => props.handleOpenGame(game)} className="w-full">
            <div className="flex flex-row items-center justify-between">
              <div className="font-semibold">Game #{game.id}</div>
              <div className="flex items-center gap-2">
                <span className="text-s text-gray-800">{game.board.length}</span>
                <span className="text-[10px] text-gray-600">x</span>
                <span className="text-s text-gray-800">{game.board.length}</span>
                <span className="text-[10px] text-gray-600"> board</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-6 h-6">
                  <Stone colour="black" cursor={false} />
                </span>
                <span className="text-s text-gray-800">{xScore}</span>
                <span className="text-[10px] text-gray-600">vs</span>
                <span className="text-s text-gray-800">{oScore}</span>
                <span className="inline-block w-6 h-6">
                  <Stone colour="white" cursor={false} />
                </span>
              </div>
              <div>
                {leader === "draw" ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-200 text-gray-800 text-xs font-semibold">tied</span>
                ) : (
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${leader === "x" ? "bg-black text-white" : "bg-white text-black border border-gray-400"}`}>
                    <span className="inline-block w-6 h-6">
                      <Stone colour={leader === "x" ? "black" : "white"} cursor={false} />
                    </span>
                    <span className="opacity-80">+{diff}</span>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-6 h-6">
                  {game.winner === "draw" && <span className="animate-bounce z-50 w-full h-full text-5xl">nobody</span>}
                  {game.winner === "x" && <Stone game={game} colour="black" cursor={false} />}
                  {game.winner === "o" && <Stone game={game} colour="white" cursor={false} />}
                </span>
              </div>
            </div>
          </button>
        </li>
      )
    })
  )

  return (
    <ul className="flex flex-col p-4 m-4 gap-2">
      {gameElements}
    </ul>
  )
}

export default List
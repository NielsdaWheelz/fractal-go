import type { GameState } from "./types.ts";
import { isPlayablePosition } from "./gorules"
import { useMoveMutation } from "./mutations"
import Stone from "./Stone"

const Board = ({ game }: { game: GameState }) => {
  const size = game.board.length;
  const sizeToGridClass: Record<number, string> = {
    5: "grid-cols-5 grid-rows-5",
    9: "grid-cols-9 grid-rows-9",
    13: "grid-cols-13 grid-rows-13",
    19: "grid-cols-19 grid-rows-19",
  };
  const gridClass = sizeToGridClass[size];

  // each cell is an object with row and col
  const cells = Array.from({ length: size * size }, (_, i) => ({
    row: Math.floor(i / size),
    col: i % size
  }))

  const moveMutation = useMoveMutation()

  const handleCellClick = (row: number, col: number) => {
    moveMutation.mutate({
      id: game.id,
      row: row,
      col: col
    })
  };

  return (
    <div className={`min-h-0 grid aspect-square p-2 self-center ${gridClass}`}>
      {cells.map(({ row, col }) => {
        const isInteriorRow = row < size - 1;
        const isInteriorCol = col < size - 1;
        return (
          <button
            key={`${row}-${col}`}
            onClick={() => handleCellClick(row, col)}
            className={`${isPlayablePosition(game, row, col) && "hover:bg-gray-200"} aspect-square border-0 border-black/70 ${isInteriorRow ? "border-b" : ""} ${isInteriorCol ? "border-r" : ""}`}>
            <span className="w-full h-full">{game.board[row][col] === "x" && <Stone colour="black" />}
            {game.board[row][col] === "o" && <Stone colour="white" />}</span>
          </button>
        );
      })}
    </div>
  );
};

export default Board;
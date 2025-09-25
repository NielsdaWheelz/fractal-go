import type { Board as BoardType } from "./types.ts";

const Board = ({ board, onCellClick }: { board: BoardType; onCellClick: (row: number, col: number) => void }) => {
  const size = board.length;
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

  return (
    <div className={`flex-1 p-2 grid aspect-square h-full w-full ${gridClass}`}>
      {cells.map(({ row, col }) => {
        const isInteriorRow = row < size - 1;
        const isInteriorCol = col < size - 1;
        return (
          <button
            key={`${row}-${col}`}
            onClick={() => onCellClick(row, col)}
            className={`${ board[row][col] ? "" : "hover:bg-gray-200"} flex items-center justify-center w-full aspect-square border-0 border-black/70 ${isInteriorRow ? "border-b" : ""} ${isInteriorCol ? "border-r" : ""}`}>
            <span className="">{board[row][col]}</span>
          </button>
        );
      })}
    </div>
  );
};

export default Board;
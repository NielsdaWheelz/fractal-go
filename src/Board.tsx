const Board = ({ board, onCellClick }) => {
  const size = board.length;
  // each cell is an object with row and col
  const cells = Array.from({ length: size * size }, (_, i) => ({
    row: Math.floor(i / size),
    col: i % size
  }))

  return (
    <div className="inline-grid grid-cols-5 grid-rows-5">
      {/* render each cell using its row-col object contents */}
      {cells.map(({ row, col }) => (
        <button
          key={`${row}-${col}`}
          onClick={() => onCellClick(row, col)}
          className={`
            w-full aspect-square
            flex items-center justify-center
            ${row < size - 1 ? "border-b" : ""}
            ${col < size - 1 ? "border-r" : ""}
            border-black
          `}
        >
          {board[row][col] /* render stone here later */}
        </button>
      ))}
    </div>
  );
};

export default Board;

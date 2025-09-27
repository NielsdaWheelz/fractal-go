import { useEffect, useRef, useState } from "react"
import type { GameState } from "./types.ts";
import { isPlayablePosition } from "./gorules"
import { useMoveMutation } from "./mutations"
import Stone from "./Stone"
import CursorStone from "./CursorStone"
import click from "./assets/piece.mp3"

const Board = (props: { game: GameState }) => {
  const size = props.game.board.length;
  const sizeToGridClass: Record<number, string> = {
    5: "grid-cols-5 grid-rows-5",
    9: "grid-cols-9 grid-rows-9",
    13: "grid-cols-13 grid-rows-13",
    19: "grid-cols-19 grid-rows-19",
  };
  const gridClass = sizeToGridClass[size];

  const firstCellRef = useRef<HTMLButtonElement | null>(null)
  const [cellSize, setCellSize] = useState<number>(0)

  useEffect(() => {
    const updateSize = () => {
      if (firstCellRef.current) {
        const rect = firstCellRef.current.getBoundingClientRect()
        setCellSize(rect.width)
      }
    }
    updateSize()
    window.addEventListener("resize", updateSize)
    return () => window.removeEventListener("resize", updateSize)
  }, [size])

  // each cell is an object with row and col
  const cells = Array.from({ length: size * size }, (_, i) => ({
    row: Math.floor(i / size),
    col: i % size
  }))

  const moveMutation = useMoveMutation()

  const audio = new Audio(click)

  const handleCellClick = (row: number, col: number) => {
    if (!isPlayablePosition(props.game, row, col)) return
    moveMutation.mutate({
      id: props.game.id,
      row: row,
      col: col
    })
    audio.currentTime = 0
    audio.play()
  };

  return (
    <div className={`w-[min(70vw,70vh)] h-[min(70vw,70vh)] grid p-2 self-center ${gridClass} bg-[url('https://images.pexels.com/photos/129728/pexels-photo-129728.jpeg')] bg-cover bg-center bg-no-repeat opacity-90`}>
      <CursorStone enabled={props.game.id} colour={props.game.currentPlayer === "x" ? "black" : "white"} size={cellSize} />
      {cells.map(({ row, col }) => {
        const isInteriorRow = row < size - 1;
        const isInteriorCol = col < size - 1;
        return (
          <button
            key={`${row}-${col}`}
            ref={row === 0 && col === 0 ? firstCellRef : null}
            onClick={() => handleCellClick(row, col)}
            className={`${isPlayablePosition(props.game, row, col) && "hover:bg-black hover:opacity-50"} aspect-square border-1 border-black/70 ${isInteriorRow ? "border-b" : ""} ${isInteriorCol ? "border-r" : ""}`}>
            <span className="w-full h-full">{props.game.board[row][col] === "x" && <Stone game={props.game} colour="black" cursor={false} />}
            {props.game.board[row][col] === "o" && <Stone game={props.game} colour="white" cursor={false} />}</span>
          </button>
        );
      })}
    </div>
  );
};

export default Board;
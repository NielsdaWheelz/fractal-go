import Board from "./Board.tsx";
import type { GameState } from "./types.ts";
import { useMoveMutation, usePassMutation } from "./mutations"

const GameComponent = (props: { data: GameState }) => {
    const moveMutation = useMoveMutation()
    const passMutation = usePassMutation()
    
    if (!props.data) return null;

    const handleCellClick = (row: number, col: number) => {
        moveMutation.mutate({
          id: props.data.id,
          row: row,
          col: col
        })
      };
      
      const handlePass = () => {
        passMutation.mutate({
          id: props.data.id
        })
      }

      console.log(props.data)

    return (
      <div className="flex flex-col items-center justify-center w-full h-full gap-3">
        <div className="w-full h-full max-w-[min(95vw,95vh)] max-h-[min(95vw,95vh)] aspect-square">
          <Board game={props.data} onCellClick={handleCellClick} />
        </div>
        <button className="bg-amber-300 hover:bg-amber-500 hover:border-amber-700 rounded-md px-4 py-1" onClick={handlePass}>Pass</button>
      </div>
    )
}

export default GameComponent

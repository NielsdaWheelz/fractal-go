import Board from "./Board.tsx";
import type { GameState } from "./types.ts";

type MoveMutation = { mutate: (vars: { id: number; row: number; col: number }) => void };
type PassMutation = { mutate: (vars: { id: number }) => void };

const GameComponent = (props: { data: GameState; moveMutation: MoveMutation; passMutation: PassMutation }) => {
    
    if (!props.data) return null;

    const handleCellClick = (row: number, col: number) => {
        if (!props.data) return;
        props.moveMutation.mutate({
          id: props.data.id,
          row: row,
          col: col
        })
      };
      
      const handlePass = () => {
        if (!props.data) return;
        props.passMutation.mutate({
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

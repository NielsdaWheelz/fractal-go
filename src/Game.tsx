import Board from "./Board.tsx";
import type { GameState } from "./types.ts";

const GameComponent = (props: { data: GameState, moveMutation, passMutation }) => {
    
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
      <div className="">
        <div className="">
          <Board board={props.data.board} onCellClick={handleCellClick} />
        </div>
        <div className="">
          <button className="" onClick={handlePass}>Pass</button>
        </div>
        {(props.data.pass["x"] && props.data.pass["o"] && props.data.winner) && (
          <div className="">{props.data.winner} Wins!</div>
        )}
      </div>
    )
}

export default GameComponent

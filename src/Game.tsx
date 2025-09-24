import Board from "./Board.tsx";

const Game = (props: { data, moveMutation, passMutation, setFunc }) => {
    
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
        <div className="p-4">
            <button onClick={() => props.setFunc(null)}>Back</button>
            <Board board={props.data.board} onCellClick={handleCellClick} />
            <button onClick={handlePass}>Pass</button>
            {(props.data.pass["x"] && props.data.pass["o"] && props.data.winner) && <div>{props.data.winner} Wins!</div>}
        </div>
    )
}

export default Game
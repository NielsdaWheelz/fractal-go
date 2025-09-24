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
      <div className="m-20 p-4 flex flex-col">
        <div><button onClick={() => props.setFunc(null)}>Go Back</button></div>
        <div className="flex flex-col items-center">
          <Board board={props.data.board} onCellClick={handleCellClick} />
        </div>
        <div className="flex flex-row justify-between">
          <div>Turn: { props.data.currentPlayer }</div>
          <div><button onClick={handlePass}>Pass</button></div>
        </div>
        {(props.data.pass["x"] && props.data.pass["o"] && props.data.winner) && <div>{props.data.winner} Wins!</div>}
      </div>
    )
}

export default Game
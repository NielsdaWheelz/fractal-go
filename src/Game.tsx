import Board from "./Board.tsx";

const Game = (props: { data, moveMutation, setFunc }) => {
    
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
        // const newGameState = calculateWinner(gameState)
        // setGameState(newGameState)
      }

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
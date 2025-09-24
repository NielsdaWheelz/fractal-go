const List = (props: {data, handleOpenGame, handleCreateGame}) => {
    const games = props.data || []
    const gameElements = games.map(game => (
        <li key={game.id} onClick={ () => props.handleOpenGame(game) }>id: { game.id }, turn: { game.currentPlayer }, Winner: { game.winner || "undecided" }</li>
    ))
    
    return (
        <>
            <ul>
                { gameElements }
            </ul>
            <button onClick={props.handleCreateGame}>Create New Game</button>
        </>
  
    )
}

export default List
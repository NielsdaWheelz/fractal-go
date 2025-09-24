const List = (props: { data, createGameMutation }) => {

    const handleCreateGame = () => {
        props.createGameMutation.mutate()
    }

    const gameElements = props.data.map(game => (
        <li key={game.id} onClick={ handleCreateGame }>{ game.id }</li>
    ))
        
    return (
        <>
            <ul>
                { gameElements }
            </ul>
            <button onClick={handleCreateGame}>Create New Game</button>
        </>
    )
}

export default List
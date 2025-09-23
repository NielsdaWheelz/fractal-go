const size = 5;

const initialBoard = Array.from({ length: size }, () =>
  Array.from({ length: size }, () => null))

export const initialGameState = {
  currentPlayer: "X",
  board: initialBoard
}

export const makeMove = (gameState, row, col) => {
  const oldPlayer = gameState.currentPlayer
  const oldBoard = gameState.board


  return newGameState
}
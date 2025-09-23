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

  const newBoard = oldBoard.map((rowArray, rowIndex) =>
    rowArray.map((cell, colIndex) =>
      rowIndex === row && colIndex === col ? oldPlayer : cell
    )
  );

  const newGameState = {
    currentPlayer: oldPlayer === "X" ? "O" : "X",
    board: newBoard
  }

  return newGameState
}
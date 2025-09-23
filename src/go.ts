import { getGroup, hasLiberties, removePieces, getEnemyNeighbours } from "./gorules.ts"

const size = 5;

const initialBoard = Array.from(
  { length: size },
  () => 
    Array.from(
      { length: size },
      () => null))

export const initialGameState = {
  currentPlayer: "X",
  board: initialBoard
}

export const makeMove = (gameState, row, col) => {
  const oldPlayer = gameState.currentPlayer
  const oldBoard = gameState.board

  let newBoard = oldBoard.map((rowArray, rowIndex) =>
    rowArray.map((cell, colIndex) =>
      rowIndex === row && colIndex === col ? oldPlayer : cell
    )
  );

  const group = getGroup(newBoard, row, col)

  const adjacentEnemyGroups = []

  for (const [r, c] of getEnemyNeighbours(newBoard, row, col)) {
    adjacentEnemyGroups.push(getGroup(newBoard, r, c))
  }

  for (const enemyGroup of adjacentEnemyGroups) {
    newBoard = !hasLiberties(newBoard, enemyGroup) ? removePieces(newBoard, enemyGroup) : newBoard
  }

  const newGameState = {
    currentPlayer: oldPlayer === "X" ? "O" : "X",
    board: newBoard
  }

  return newGameState
}
import { getGroup, hasLiberties, removePieces, getEnemyNeighbours } from "./gorules.ts"
import type { GameState } from "./types"

// const initialBoard = (size) => {
//   Array.from(
//     { length: size },
//     () => 
//       Array.from(
//         { length: size },
//         () => null))
// }

// export const initialGameState = (id) => {
//   id: id
//   currentPlayer: "x",
//   board: initialBoard(size),
//   x_pass: false,
//   o_pass: false,
//   winner: null
// }

export const makeMove = (gameState: GameState, row: number, col: number) => {
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
    ...gameState,
    currentPlayer: oldPlayer === "x" ? "o" : "x",
    board: newBoard,
    pass: { x: false, o: false },
    winner: null
  }

  return newGameState
}

export const calculateWinner = (gameState) => {
  const oldPlayer = gameState.currentPlayer
  let newGameState
  if (oldPlayer === "x") {
    newGameState = {
      ...gameState,
      currentPlayer: oldPlayer === "x" ? "o" : "x",
      x_pass: true}
  } else if (oldPlayer === "o") {
    newGameState = {
      ...gameState,
      currentPlayer: oldPlayer === "x" ? "o" : "x",
      o_pass: true}
  }
  
  if (newGameState.x_pass && newGameState.o_pass) {
    let xScore = 0
    let oScore = 0
    for (let i = 0; i < newGameState.board.length; i++) {
      for (let j = 0; j < newGameState.board[i].length; j++) {
        if (newGameState.board[i][j] === "x") {xScore++} else if (newGameState.board[i][j] === "o") {oScore++}
      }
    }
    if ((xScore - oScore) > 0) {
      return {...newGameState, winner: "x"}
    } else if ((xScore - oScore) < 0){
      return {...newGameState, winner: "o"}
    } else if ((xScore - oScore) === 0) {
      return {...newGameState, winner: "draw"}
    }
  }
  return newGameState
}
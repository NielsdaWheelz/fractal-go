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
  board: initialBoard,
  pass: { x: false, o: false },
  winner: null
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
    board: newBoard,
    pass: { x: false, o: false },
    winner: null
  }

  return newGameState
}

export const calculateWinner = (gameState) => {
  // set the pass of the current player to true
  let newGameState = {...gameState, pass: {...gameState.pass, [gameState.currentPlayer]: true}}
  if (newGameState.pass["x"] && newGameState.pass["o"]) {
    let xScore = 0
    let oScore = 0
    for (let i = 0; i < newGameState.board.length; i++) {
      for (let j = 0; j < newGameState.board[i].length; j++) {
        if (newGameState.board[i][j] === "X") {xScore++} else if (newGameState.board[i][j] === "O") {oScore++}
      }
    }
    if ((xScore - oScore) > 0) {
      return {...newGameState, winner: "x"}
      // gameState where winner: "x"
    } else {
      return {...newGameState, winner: "o"}
    }
  }
  return newGameState
}
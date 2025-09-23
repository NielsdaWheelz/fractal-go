export const isValidPosition = (board, row, col) => {
  return row >= 0 && row < board.length && 
         col >= 0 && col < board[0].length;
}

export const getGroup = (currentBoard, row, col) => {
  const targetColour = currentBoard[row][col]
  const group = []
  const visited = new Set()

  const dfs = (currentBoard, row, col, targetColour) => {
    const key = `${row},${col}`;
    if (!isValidPosition(currentBoard, row, col) || currentBoard[row][col] !== targetColour || visited.has(key)) return
    visited.add(key);
    group.push([row, col])

    dfs(currentBoard, row + 1, col, targetColour)
    dfs(currentBoard, row - 1, col, targetColour)
    dfs(currentBoard, row, col + 1, targetColour)
    dfs(currentBoard, row, col - 1, targetColour)
  }

  dfs(currentBoard, row, col, targetColour)

  return group
}

export const getEnemyNeighbours = (currentBoard, row, col) => {
  const neighbours = [[1,0], [-1,0], [0,1], [0,-1]]
  let enemyNeighbours = []
  for (let i = 0; i < neighbours.length; i++) {
    const [dr, dc] = neighbours[i]
    const nr = row + dr
    const nc = col + dc
    if (currentBoard[nr][nc] !== currentBoard[row][col]) enemyNeighbours.push([nr, nc])
  }

  return enemyNeighbours
}

export const hasLiberties = (currentBoard, group) => {
  for (let i = 0; i < group.length; i++) {
    const [r, c] = group[i]
    const neighbours = [[1,0], [-1,0], [0,1], [0,-1]]
    for (let j = 0; j < neighbours.length; j++) {
      const [dr, dc] = neighbours[j]
      const nr = r + dr
      const nc = c + dc
      if (isValidPosition(currentBoard, nr, nc) && currentBoard[nr][nc] === null) return true
    }
  }

  return false
}

export const removePieces = (oldBoard, group) => {
  let newBoard = oldBoard.map((rowArray, rowIndex) => 
    rowArray.map((cell, colIndex) => cell))

  for (const [r, c] of group) {
    newBoard[r][c] = null
  }

  return newBoard
}
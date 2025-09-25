export const getGames = async () => {
    try {
      const response = await fetch(`/games`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const games = await response.json()
      return games
    } catch (error) {
      console.error("Error", error)
      throw error
    }
}

export const getGame = async (id) => {
    try {
      const response = await fetch(`/game/${id}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const game = await response.json()
      return game
    } catch (error) {
      console.error("Error", error)
      throw error
    }
}

export const postMove = async (id, row, col) => {
    try {
      const response = await fetch("/move", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id, row: row, col: col})
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const game = await response.json()
      return game
    } catch (error) {
      console.error("error", error)
      throw error
    }
}

export const postPass = async (id) => {
  try {
    const response = await fetch("/pass", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const game = await response.json()
    return game
  } catch (error) {
    console.error("error", error)
    throw error
  }
}

export const createGame = async (size) => {
    try {
      const response = await fetch("/games", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ size: size })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const game = await response.json()
      return game
    } catch (error) {
      console.error("error", error)
      throw error
    }
}

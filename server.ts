import express from "express"
import ViteExpress from "vite-express"
import data from "./data.json"

import { makeMove } from "./src/go.ts"

const app = express()

const initialBoard = Array.from(
    { length: 5 },
    () => 
      Array.from(
        { length: 5 },
        () => null))
  
app.get("/message", (_, res) => res.send("Hello"))

app.get("/game/:id", (req, res) => {
    const game = data.games.find(game => game.id === Number(req.params.id))
    let newGame
    if (game.board === null) newGame = {...game, board: initialBoard}
    res.json(newGame)
})

app.post("/move", (req, res) => {
    const game = data.games.find(game => game.id === Number(req.body.game.id))
    if (game.board[req.body.game.row][req.body.game.col] !== null || (game.pass["x"] && game.pass["o"])) return
    const newGame = makeMove(game, row, col)
    res.json(newGame)
})

ViteExpress.listen(app, 3000, () => console.log("listening..."))
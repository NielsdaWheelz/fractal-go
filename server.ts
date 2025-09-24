import express from "express"
import ViteExpress from "vite-express"
import data from "./data.json"
import fs from "fs"

let games = data.games
let game

const generatedId = () => {
    const maxId = games.length > 0
    ? Math.max(...games.map(n => Number(n.id)))
    : 0
    return Number(maxId + 1)
}

import { makeMove } from "./src/go.ts"

const app = express()

app.use(express.json())

app.get("/games", (req, res) => {
    res.json(games)
})

app.get("/game/:id", (req, res) => {
    game = games.find(game => game.id === Number(req.params.id))
    res.json(game)
})

app.post("/games", (req, res) => {
    const newGame = {
        "id": generatedId(),
        "currentPlayer": "X",
        "board": [[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null]],
        "pass": {
          "x": false,
          "o": false
        },
        "winner": null
    }
    games = games.concat(newGame)
    fs.writeFileSync("data.json", JSON.stringify({games: games}, null, 2))
    res.json(newGame)
})

app.post("/move", (req, res) => {
    game = games.find(game => game.id === Number(req.body.id))
    if (game.board[req.body.row][req.body.col] !== null || (game.pass["x"] && game.pass["o"])) return
    const newGame = makeMove(game, req.body.row, req.body.col)
    games = games.map(game => game.id === newGame.id ? newGame : game)
    fs.writeFileSync("data.json", JSON.stringify({games: games}, null, 2))
    res.json(game)
})

ViteExpress.listen(app, 3000, () => console.log("listening..."))
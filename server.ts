import express from "express"
import ViteExpress from "vite-express"
import data from "./data.json"
// import fs from "fs"

let game = data.game

// let games = data.games

import { makeMove } from "./src/go.ts"

const app = express()

app.use(express.json())

app.get("/message", (_, res) => res.send("Hello"))

app.get("/game/:id", (req, res) => {
    // game = data.games.find(game => game.id === Number(req.params.id))
    // game = data.game
    res.json(game)
})

app.post("/move", (req, res) => {
    // game = data.games.find(game => game.id === Number(req.body.id))
    // game = data.game
    if (game.board[req.body.row][req.body.col] !== null || (game.pass["x"] && game.pass["o"])) return
    game = makeMove(game, req.body.row, req.body.col)
    // games = games.concat(game)
    // fs.writeFileSync("data.json", JSON.stringify({game: game}, null, 2))
    res.json(game)
})

ViteExpress.listen(app, 3000, () => console.log("listening..."))
import express from "express"
import ViteExpress from "vite-express"
import fs from "fs"
import http from "http"
import { Server } from "socket.io"

const app = express()
// const server = app.listen(3000, "0.0.0.0")
// --- Socket.IO Setup ---
const io = new Server({
    cors: {
        origin: "*", // Change this if you want stricter cross-origin rules
    }
})
io.listen(4000);

// Initialize games by reading from data.json at runtime, not via module import
let games: any[] = []
try {
    const raw = fs.readFileSync("data.json", "utf-8")
    const parsed = JSON.parse(raw)
    games = Array.isArray(parsed?.games) ? parsed.games : []
} catch (err) {
    // If file is missing or invalid, start with empty games list
    games = []
}
let game

const generatedId = () => {
    const maxId = games.length > 0
    ? Math.max(...games.map(n => Number(n.id)))
    : 0
    return Number(maxId + 1)
}

import { makeMove, calculateWinner } from "./src/go.ts"



io.on("connection", (socket) => {
    console.log("Socket.IO client connected:", socket.id)

    // Optionally send initial state
    socket.emit("init", games)

    socket.on("disconnect", () => {
        console.log("Socket.IO client disconnected:", socket.id)
    })
})


app.use(express.json())

app.get("/games", (req, res) => {
    res.json(games)
})

app.get("/game/:id", (req, res) => {
    game = games.find(game => game.id === Number(req.params.id))
    if (!game) return res.status(404).json({ error: "Game not found" })
    res.json(game)
})

app.post("/games", (req, res) => {
    const size = Number(req.body.size)

    const board = Array.from({ length: size }, () => Array(size).fill(null))

    const newGame = {
        "id": generatedId(),
        "currentPlayer": "X",
        "board": board,
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
    if (!game) return res.status(404).json({ error: "Game not found" })
    if (game.board[req.body.row][req.body.col] !== null || (game.pass["x"] && game.pass["o"])) {
        return res.status(400).json({ error: "Invalid move" })
    }
    const newGame = makeMove(game, req.body.row, req.body.col)
    games = games.map(game => game.id === newGame.id ? newGame : game)
    fs.writeFileSync("data.json", JSON.stringify({games: games}, null, 2))
    res.json(newGame)
})

app.post("/pass", (req, res) => {
    game = games.find(game => game.id === Number(req.body.id))
    if (!game) return res.status(404).json({ error: "Game not found" })
    const newGame = calculateWinner(game)
    games = games.map(game => game.id === newGame.id ? newGame : game)
    fs.writeFileSync("data.json", JSON.stringify({games: games}, null, 2))
    res.json(newGame)
})

ViteExpress.listen(app, 3000, () => console.log("listening..."))
// ViteExpress.bind(app, server);
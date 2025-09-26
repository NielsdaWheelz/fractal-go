import express from "express"
import ViteExpress from "vite-express"
import fs from "fs"
import { Server } from "socket.io"
import { makeMove, calculateWinner } from "./src/go.ts"

const app = express()
const io = new Server({
    cors: {
        origin: "*", // Change this if you want stricter cross-origin rules
    }
})
io.listen(4000);

io.on("connection", (socket) => {
    console.log("Socket.IO client connected:", socket.id)

    socket.emit("init", games)

    socket.on('game:join', (id) => socket.join('game:'+id))

    socket.on('game:leave', (id) => socket.leave('game:'+id))

    socket.on("games:created", ({ size }) => {
        io.emit("games:updated", createGame(size).games)
    })

    socket.on("game:move", ({ id, row, col }) => {
        const game = games.find(game => game.id === id)
        if (!game) return

        const updatedGame = makeMove(game, row, col)
        games = games.map(game => game.id === id ? updatedGame : game)
        fs.writeFileSync("data.json", JSON.stringify({ games }, null, 2))

        io.to(`game:${id}`).emit("game:updated", updatedGame)

        io.emit("games:updated", games)
    })

    socket.on("game:pass", ({ id }) => {
        const game = games.find(game => game.id === id)
        if (!game) return

        const updatedGame = calculateWinner(game)
        games = games.map(game => game.id === id ? updatedGame : game)
        fs.writeFileSync("data.json", JSON.stringify({ games }, null, 2))

        io.to(`game:${id}`).emit("game:updated", updatedGame)

        io.emit("games:updated", games)
    })

    socket.on("disconnect", () => {
        console.log("Socket.IO client disconnected:", socket.id)
    })
})

let games: any[] = []
try {
    const raw = fs.readFileSync("data.json", "utf-8")
    const parsed = JSON.parse(raw)
    games = Array.isArray(parsed?.games) ? parsed.games : []
} catch (err) {
    games = []
}

const generatedId = () => {
    const maxId = games.length > 0
    ? Math.max(...games.map(n => Number(n.id)))
    : 0
    return Number(maxId + 1)
}

const getGame = (id: number) => {
    return games.find(game => game.id === Number(id))
}

const createGame = (size: number) => {
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
    return {newGame, games}
}

app.use(express.json())

app.get("/games", (req, res) => {
    res.json(games)
})

app.get("/game/:id", (req, res) => {
    const game = getGame(Number(req.params.id))
    if (!game) return res.status(404).json({ error: "Game not found" })
    res.json(game)
})

app.post("/games", (req, res) => {
    const result = createGame(Number(req.body.size))
    io.emit('games:updated', result.games)
    res.json(result.newGame)
})

app.post("/move", (req, res) => {
    const game = getGame(Number(req.body.id))
    if (!game) return res.status(404).json({ error: "Game not found" })
    if (game.board[req.body.row][req.body.col] !== null || (game.pass["x"] && game.pass["o"])) {
        return res.status(400).json({ error: "Invalid move" })
    }
    const newGame = makeMove(game, req.body.row, req.body.col)
    games = games.map(game => game.id === newGame.id ? newGame : game)
    fs.writeFileSync("data.json", JSON.stringify({games: games}, null, 2))
    io.to(`game:${newGame.id}`).emit('game:updated', newGame)
    io.emit('games:updated', games)
    res.json(newGame)
})

app.post("/pass", (req, res) => {
    const game = getGame(Number(req.body.id))
    if (!game) return res.status(404).json({ error: "Game not found" })
    const newGame = calculateWinner(game)
    games = games.map(game => game.id === newGame.id ? newGame : game)
    fs.writeFileSync("data.json", JSON.stringify({games: games}, null, 2))
    io.to(`game:${newGame.id}`).emit('game:updated', newGame)
    io.emit('games:updated', games)
    res.json(newGame)
})

ViteExpress.listen(app, 3000, () => console.log("listening..."))
// ViteExpress.bind(app, server);
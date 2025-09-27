import express from "express"
import ViteExpress from "vite-express"
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import { gamesTable } from './src/db/schema';
import postgres from 'postgres';

import { Server } from "socket.io"
import { makeMove, calculateWinner } from "./src/go.ts"

const app = express()
app.use(express.json())

const io = new Server({
    cors: {
        origin: "*",
    }
})
io.listen(4000);
io.on("connection", async (socket) => {
    console.log("Socket.IO client connected:", socket.id)

    socket.emit("init", await getGames())

    socket.on('game:join', (id) => {
        console.log(`[socket] ${socket.id} joining room game:${id}`)
        socket.join('game:'+id)
    })

    socket.on('game:leave', (id) => {
        console.log(`[socket] ${socket.id} leaving room game:${id}`)
        socket.leave('game:'+id)
    })

    socket.on("games:created", async ({ size }) => {
        const result = await createGame(size)
        io.emit("games:updated", result.games)
    })

    socket.on("game:move", async ({ id, row, col }) => {
        const result = await move(id, row, col)
        if (!result || !result.game) return
        const { game, games } = result
        console.log(`[emit] game:updated -> game:${id} (move ${row},${col})`)
        io.to(`game:${id}`).emit("game:updated", game)
        io.emit("games:updated", games)
    })

    socket.on("game:pass", async ({ id }) => {
        const result = await pass(id)
        if (!result) return
        const {game, games} = result
        console.log(`[emit] game:updated -> game:${id} (pass)`)        
        io.to(`game:${id}`).emit("game:updated", game)
        io.emit("games:updated", games)
    })

    socket.on("disconnect", () => {
        console.log("Socket.IO client disconnected:", socket.id)
    })
})
const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client);
// const db = drizzle(process.env.DATABASE_URL!);

const getDbGameRow = async (id: number) => {
    const rows = await db.select().from(gamesTable).where(eq(gamesTable.id, id));
    return rows[0] ?? null
}

const getGame = async (id: number) => {
    const row = await getDbGameRow(id)
    return row
}

const getGames = async () => {
    const rows = await db.select().from(gamesTable);
    return rows
}

const createGame = async (size: number) => {
    const board = Array.from({ length: size }, () => Array(size).fill(null))
    
    let newGame: typeof gamesTable.$inferInsert = {
        "currentPlayer": "x",
        "board": board,
        "x_pass": false,
        "o_pass": false,
        "winner": null
    }
    const insertedRows = await db.insert(gamesTable).values(newGame).returning();
    const game = insertedRows[0]
    const games = await getGames()
    return {game, games}
}

const move = async (id: number, row: number, col: number) => {
    const dbRow = await getDbGameRow(id)
    if (!dbRow) return { game: null, games: await getGames() }

    const oldGame = dbRow
    const updatedGame = makeMove(oldGame, row, col)
    const updatedRows = await db.update(gamesTable).set({board: updatedGame.board, currentPlayer: updatedGame.currentPlayer}).where(eq(gamesTable.id, id)).returning();
    const game = updatedRows[0]
    const games = await getGames()
    return {game, games}
}

const pass = async (id: number) => {
    const dbRow = await getDbGameRow(id)
    if (!dbRow) return
    const oldGame = dbRow
    const updatedGame = calculateWinner(oldGame)
    const updatedRows = await db.update(gamesTable)
        .set({ board: updatedGame.board, currentPlayer: updatedGame.currentPlayer, x_pass: updatedGame.x_pass!, o_pass: updatedGame.o_pass!, winner: updatedGame.winner })
        .where(eq(gamesTable.id, id))
        .returning();
    const game = updatedRows[0] ? updatedRows[0] : updatedGame
    const games = await getGames()
    return {game, games}
}

app.get("/games", async (req, res) => {
    const games = await getGames()
    res.json(games)
})

app.get("/game/:id", async (req, res) => {
    const game = await getGame(Number(req.params.id))
    if (!game) return res.status(404).json({ error: "Game not found" })
    res.json(game)
})

app.post("/games", async (req, res) => {
    const result = await createGame(Number(req.body.size))
    io.emit('games:updated', result.games)
    res.json(result.game)
})

app.post("/move", async (req, res) => {
    const {game, games} = await move(req.body.id, req.body.row, req.body.col)
    if (!game) return res.status(404).json({ error: "Game not found" })
    io.to(`game:${game.id}`).emit('game:updated', game)
    io.emit('games:updated', games)
    res.json(game)
})

app.post("/pass", async (req, res) => {
    const {game, games} = await pass(req.body.id)
    if (!game) return res.status(404).json({ error: "Game not found" })
    io.to(`game:${game.id}`).emit('game:updated', game)
    io.emit('games:updated', games)
    res.json(game)
})

ViteExpress.listen(app, 3000, () => console.log("listening..."))
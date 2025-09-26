import { integer, pgTable, pgEnum, jsonb, boolean } from "drizzle-orm/pg-core";

export const playerEnum = pgEnum('player', ['x', 'o']);
export const winnerEnum = pgEnum('winner', ['x', 'o', 'draw']);

export const gamesTable = pgTable("gamesTable", {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  currentPlayer: playerEnum('currentPlayer').notNull(),
  board: jsonb('board').notNull(),
  x_pass: boolean('x_pass').notNull(),
  o_pass: boolean('o_pass').notNull(),
  winner: winnerEnum('winner')
});
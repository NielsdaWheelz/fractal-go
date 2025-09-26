// Centralized shared types for the Go-like game

export type Player = "x" | "o";

export type Cell = Player | null;

export type Board = Cell[][];

export type Position = [number, number]; // [row, col]

export type Group = Position[];

export type Winner = Player | "draw" | null;

export type GameState = {
  id: number
  currentPlayer: Player;
  board: Board;
  x_pass: boolean,
  o_pass: boolean,
  winner: Winner; // set when game is over
};



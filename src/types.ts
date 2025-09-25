// Centralized shared types for the Go-like game

export type Player = "X" | "O";

export type Cell = Player | null;

export type Board = Cell[][];

export type Position = [number, number]; // [row, col]

export type Group = Position[];

export type Winner = Player | "Draw" | null;

export type GameState = {
  id: number
  currentPlayer: Player;
  board: Board;
  pass: {
    "x": boolean,
    "o": boolean
  };
  winner: Winner; // set when game is over
};



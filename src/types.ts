// Centralized shared types for the Go-like game

export type Player = "X" | "O";

export type Cell = Player | null;

export type Board = Cell[][];

export type Position = [number, number]; // [row, col]

export type Group = Position[];

export type Winner = Player | "Draw" | null;

export type GameState = {
  currentPlayer: Player;
  board: Board;
  consecutivePasses: number; // number of consecutive pass turns
  resignedBy: Player | null; // the player who resigned, if any
  winner: Winner; // set when game is over
};



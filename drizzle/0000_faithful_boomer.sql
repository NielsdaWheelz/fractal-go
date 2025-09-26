CREATE TYPE "public"."player" AS ENUM('x', 'o');--> statement-breakpoint
CREATE TYPE "public"."winner" AS ENUM('x', 'o', 'draw');--> statement-breakpoint
CREATE TABLE "gamesTable" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "gamesTable_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"currentPlayer" "player" NOT NULL,
	"board" jsonb NOT NULL,
	"x_pass" boolean NOT NULL,
	"o_pass" boolean NOT NULL,
	"winner" "winner"
);

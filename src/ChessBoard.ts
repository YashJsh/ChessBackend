import { WebSocket } from "ws";
import { Chess } from "chess.js";
import { Player } from "./connect";
import { GameManager } from "./GameManager";

export class ChessBoard {
  public player1: Player;
  public player2: Player;
  private board: Chess;
  public move: [];
  public startTime: Date;
  public GameManager = new GameManager();

  constructor(player1: Player, player2: Player) {
    this.player1 = player1;
    this.player2 = player2;
    this.board = new Chess();
    this.move = [];
    this.startTime = new Date();
  }

  public makeMove(
    player: Player,
    move: {
      from: string;
      to: string;
    }
  ): boolean {
    console.log(`Player  made a move: ${move}`);
    console.log(move.from);
    console.log(move.to);
    console.log(this.board.fen());
    try {
      this.board.move(
        { from: move.from, to: move.to } // The ending square, e.g., 'e4'
      );
      console.log("Move has been made");
      console.log(this.board.fen());
      const gameStatus = this.checkGameStatus();
      return gameStatus === "ongoing";
    } catch (err) {
      console.log("Invalid Move");
      return false;
    }
  }

  public checkGameStatus(): string {
    let winner = "";

    // Check if the game is over
    if (this.board.isGameOver()) {
      console.log("Game Over Detected");

      // Check if the game ended with checkmate
      if (this.board.isCheckmate()) {
        console.log("Checkmate detected!");

        
        const currentTurn = this.board.turn();
        console.log("Current Turn: ", currentTurn);

        if (currentTurn === "b") {
          winner = "white";
          this.player2.send(
            JSON.stringify({ type: "gameOver", winner: "white" })
          );
          this.player1.send(
            JSON.stringify({ type: "gameOver", winner: "white" })
          );
        } else {
          winner = "black";
          this.player1.send(
            JSON.stringify({ type: "gameOver", winner: "black" })
          );
          this.player2.send(
            JSON.stringify({ type: "gameOver", winner: "black" })
          );
        }
        return "checkmate";
      }

      // Check for stalemate or insufficient material
      else if (
        this.board.isStalemate() ||
        this.board.isInsufficientMaterial()
      ) {
        this.player1.send(JSON.stringify({ type: "gameOver", winner: "draw" }));
        this.player2.send(JSON.stringify({ type: "gameOver", winner: "draw" }));
        return "draw";
      }
    }

    return "ongoing";
  }
}

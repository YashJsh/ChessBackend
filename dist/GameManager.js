"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
const ChessBoard_1 = require("./ChessBoard");
class GameManager {
    constructor() {
        this.activeGames = new Map();
        this.roomCount = 0;
    }
    PairPlayers(player1, player2) {
        const roomId = `room-${++this.roomCount}`; // Generate a unique room ID
        player1.roomID = roomId;
        console.log("Room Id of Player  1 is " + roomId);
        player2.roomID = roomId;
        console.log("Room Id of Player  2 is " + roomId);
        console.log("Recieved in Pair Players in Game Manager");
        const game = new ChessBoard_1.ChessBoard(player1, player2);
        this.activeGames.set(roomId, game);
        console.log(`New game created: ${roomId}`);
        // Notify players that they are paired
        [player1, player2].forEach((player) => {
            player.send(JSON.stringify({
                type: "connected",
                roomId,
                message: "You are paired. Start the game!",
            }));
        });
        this.gameCommunication(player1, player2);
    }
    gameCommunication(player1, player2) {
        const roomId = player1.roomID || "";
        [player1, player2].forEach((player) => {
            player.on("message", (data) => {
                try {
                    const message = JSON.parse(data.toString());
                    const game = this.activeGames.get(roomId);
                    if (!game) {
                        player.send(JSON.stringify({
                            type: "error",
                            messsage: "Game not found",
                        }));
                        return;
                    }
                    if (message.type === "move") {
                        console.log("recieved move", message);
                        const moveSuccess = game.makeMove(player, message.move);
                        if (moveSuccess) {
                            // Notify both players of the successful move
                            [game.player1, game.player2].forEach((p) => {
                                p.send(JSON.stringify({
                                    type: "move",
                                    move: message.move,
                                }));
                            });
                        }
                        else {
                            // Notify the player of an invalid move
                            player.send(JSON.stringify({
                                type: "error",
                                message: "Invalid move.",
                            }));
                        }
                    }
                    else if (message.type === "text") {
                        // Relay chat messages to the opponent
                        const opponent = player === game.player1 ? game.player2 : game.player1;
                        opponent.send(JSON.stringify({
                            type: "text",
                            text: message.text,
                        }));
                    }
                    else {
                        // Handle unsupported message types
                        player.send(JSON.stringify({
                            type: "error",
                            message: "Unsupported message type.",
                        }));
                    }
                }
                catch (err) {
                    console.error("Error processing message:", err);
                    // Notify the player of a message parsing error
                    player.send(JSON.stringify({
                        type: "error",
                        message: "Invalid message format.",
                    }));
                }
            });
        });
    }
}
exports.GameManager = GameManager;

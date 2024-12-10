"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectUser = void 0;
const GameManager_1 = require("./GameManager");
class connectUser {
    constructor() {
        this.GameManager = new GameManager_1.GameManager();
        this.queue = [];
    }
    addUser(socket) {
        const player = socket;
        try {
            this.queue.push(player);
            console.log("User added to queuee");
            console.log(this.queue.length);
            if (this.queue.length >= 2) {
                console.log("Pairing Players ....");
                const player1 = this.queue.shift();
                const player2 = this.queue.shift();
                console.log("Players Paired");
                this.GameManager.PairPlayers(player1, player2);
            }
            else {
                player.send(JSON.stringify({
                    type: "Waiting",
                    message: "Waiting for the Second Player to connect...",
                }));
            }
        }
        catch (err) {
            console.log("Unable to add to the queue", err);
        }
    }
}
exports.connectUser = connectUser;

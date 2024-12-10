import { WebSocket } from "ws";
import { GameManager } from "./GameManager";

export interface Player extends WebSocket {
    roomID? : string;
}

export class connectUser{
    private queue : Player[];
    public GameManager = new GameManager();
    constructor(){
        this.queue = [];
    }

    public addUser(socket : Player){
        const player = socket as Player;
        try{
            this.queue.push(player);
            console.log("User added to queuee")
            console.log(this.queue.length);
            if (this.queue.length >= 2) {
                console.log("Pairing Players ....");
                const player1 = this.queue.shift()!;
                const player2 = this.queue.shift()!;
                console.log("Players Paired");
                this.GameManager.PairPlayers(player1, player2);
            }else{
                player.send(
                    JSON.stringify({
                        type: "Waiting",
                        message: "Waiting for the Second Player to connect...",
                      })
                )
            }
        }
        catch(err){
            console.log("Unable to add to the queue",err);
        }
    }
}
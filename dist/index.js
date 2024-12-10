"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const connect_1 = require("./connect");
const wss = new ws_1.WebSocketServer({ port: 8080 });
const connect = new connect_1.connectUser();
wss.on("connection", function connection(ws) {
    ws.on("error", console.error);
    connect.addUser(ws);
    ws.send("User Connected");
});

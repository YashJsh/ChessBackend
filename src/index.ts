import { WebSocketServer } from "ws";
import { connectUser } from "./connect";

const wss = new WebSocketServer({ port: 8080 });

const connect = new connectUser();

wss.on("connection", function connection(ws) {
  ws.on("error", console.error);
  connect.addUser(ws);
  ws.send("User Connected");
});

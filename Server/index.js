const WebSocket = require("ws");

const wss = new WebSocket.Server({port: 8082});
let connected_client_sockets = [];

wss.on("connection", ws => {
    console.log("new client connected!");
    connected_client_sockets.push(ws);

    ws.on('message', data => {
        console.log('Client has sent us: ' + data.toString());
        ws.send("test data: " + data.toString());
        for (let i = 0; i < connected_client_sockets.length; i++) {
            connected_client_sockets[i].send("another person just joined!");
        }
    });

    ws.on("close", () => {
        console.log("Client has disconnected!");
    });
});
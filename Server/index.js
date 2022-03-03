const WebSocket = require("ws");

const wss = new WebSocket.Server({port: 8082});

wss.on("connection", ws => {
    console.log("new client connected!");

    ws.on('message', data => {
        console.log('Client has sent us: ' + data.toString());
        ws.send("test data: " + data.toString());
    });

    ws.on("close", () => {
        console.log("Client has disconnected!");
    });
});
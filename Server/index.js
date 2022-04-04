const http = require('http');
const WebSocket = require("ws");

const wss = new WebSocket.Server({port: 8082}); ////

console.log("Websocket server starting...");

let connected_client_sockets = []; // extry format: {int socketID, Socket socket}

//gets the index of a specified socket
function get_socket_id(socket) {
    return connected_client_sockets.indexOf(socket);
}


// when a user connected to the server.
wss.on("connection", ws => {
    console.log("new client connected!");
    connected_client_sockets.push(ws);
    let message = {
        messageType: "connectionConfirmation",
        connectionMessage: "Your user index is: " + get_socket_id(ws).toString(),
        userId: get_socket_id(ws)
    }
    ws.send(JSON.stringify(message));


    ws.on('message', data => {
        console.log('Client has sent us: ' + data.toString());
        if (data != "connecting") {
            for (let i = 0; i < connected_client_sockets.length; i++) {
                connected_client_sockets[i].send(data.toString());
            }
        } 
        
        else {
            for (let i = 0; i < connected_client_sockets.length; i++) {
                let message = {
                    messageType: "userConnectedMessage",
                    connectionMessage: "another person just joined! Their user index is: " + get_socket_id(ws).toString()
                };
                connected_client_sockets[i].send(JSON.stringify(message));
            }
        }
    });

    ws.on("close", () => {
        console.log("Client has disconnected!");
    });
});
const gameControl = require("./game-control-server.js");
const storyControl = require("./story-control-server.js");

const http = require('http');
const WebSocket = require("ws");

const wss = new WebSocket.Server({port: 8082}); ////

console.log("Websocket server starting...");

let connected_client_sockets = []; // extry format: {int id, Socket socket, string username}

//gets the entry in the connected_client_sockets list for a player with the specified socket
function get_connected_player(socket)
{
    let socket_entry = connected_client_sockets.find(s => s.socket == socket);
    if (socket_entry != null)
    {
        return socket_entry;
    }
    else
    {
        return null;
    }
}

//gets the player id of a specified socket
function get_player_id(socket) {
    let socket_entry = connected_client_sockets.find(s => s.socket == socket);
    if (socket_entry != null)
    {
        return socket_entry.id;
    }
    else
    {
        return -1;
    }
}

//gets the index of a specified socket in the connected_client_sockets list
function get_socket_index(socket) {
    let socket_entry = connected_client_sockets.find(s => s.socket == socket);
    if (socket_entry != null)
    {
        return connected_client_sockets.indexOf(socket_entry);
    }
    else
    {
        return -1;
    }
}

function generate_socket_id()
{
    let id = 0;
    let found_id = false;
    for (let i = 0; i < connected_client_sockets.length && !found_id; i++)
    {
        if (connected_client_sockets.find(s => s.id == i) == null)
        {
            id = i;
            found_id = true;
        }
    }
    if (!found_id)
    {
        id = connected_client_sockets.length;
    }
    // console.log("generated id is " + id);
    return id;
}

function send_data_to_client(ws, data)
{
    ws.send(JSON.stringify(data));
}


// Changes the username stored for the user at the specified socket
function changeUsername(ws, data) {
    console.log(data.data.username);
    let player = get_connected_player(ws);
    if (player != null)
    {
        player.username = data.data.username;
        console.log("new username change: user id " +  get_player_id(ws) + "'s name is now " + player.username);
        refreshNamesListAllClients();

    }
}
// Refreshes the names list for all clients
function refreshNamesListAllClients() {
    let players = getPlayers();
    console.log("Sending updated player list:");
    console.log(players);
    let message = {
        messageType: "refreshUsernamesList",
        data: 
        {
            "players": players
        },
        userId: -1 //server
    };
    send_data_to_all_clients(message);
}


//gets a players list
function getPlayers() {
    let players = [];
    connected_client_sockets.forEach(element =>
    {
        players.push(
            {
                "username": element.username,
                "id": element.id
            }
        );

    } );
    return players;
}


function send_data_to_all_clients(data)
{
    for (let i = 0; i < connected_client_sockets.length; i++) 
    {
        send_data_to_client(connected_client_sockets[i].socket, data);
        // connected_client_sockets[i].send(JSON.stringify(data));
    }
}


// when a user connected to the server.
wss.on("connection", ws => {
    console.log("New client connected!");
    

    // store the new player
    let playerID = generate_socket_id();
    connected_client_sockets.push(
        {
            "id": playerID,
            "socket":ws,
            "username": "User " + playerID.toString()
        }
    );
    changeUsername(ws, {data: {username: "User " + playerID.toString()}});
    
    let message = {
        messageType: "connectionConfirmation",
        connectionMessage: "Your user index is: " + get_player_id(ws).toString(),
        userId: get_player_id(ws)
    }
    // ws.send(JSON.stringify(message));
    send_data_to_client(ws, message);


    ws.on('message', raw_data => {
        // console.log('Client has sent us: ' + raw_data.toString());
        // console.log('message type: ' + JSON.parse(raw_data).messageType);

        let data = JSON.parse(raw_data);

        switch (data.messageType)
        {
            case "connecting":
                let message = {
                    messageType: "userConnectedMessage",
                    connectionMessage: "another person just joined! Their user index is: " + get_player_id(ws).toString()
                };
                send_data_to_all_clients(message);
                break;
            case "gameControl":
                gameControl.interpretGameControlCommand(get_player_id(ws), data);
                break;
            case "storyControl":
                storyControl.interpretStoryControlCommand(get_player_id(ws), data);
                break;
            case "changeUsername":
                changeUsername(ws, data);
                break;
            default:
                send_data_to_all_clients(data);
                break;
        }
    });

    ws.on("close", () => {
        console.log("Client has disconnected!");
        
        let disconnected_index = connected_client_sockets.findIndex(entry => entry.socket == ws);
        if (disconnected_index >= 0)
        {
            connected_client_sockets.splice(disconnected_index, 1);
        }
        refreshNamesListAllClients();
        if (gameControl.gameIsActive())
        {
            gameControl.endGame();
        }
    });
});

module.exports =
{
    connected_client_sockets,
    send_data_to_all_clients,
    send_data_to_client,
    get_player_id
};
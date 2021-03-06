export {networking};
import {interpretCommand} from "./canvas.js";
import { interpretGameControlCommand } from "./game-control-client.js";
import { showPage } from "./screen-type-manager.js";
import { interpretStoryControlCommand } from "./story-control-client.js";
import { updateNamesList } from "./story-control-client.js";


class NetworkingObject {
    usersConnected;

    constructor() {
        // do nothing
    }
    sendMessage(type, dataToSend)
    {
        let message = {
            messageType: type,
            data: dataToSend,
            userId: networking.getUserId()
        };
        try {
            this.sendMessageJson(JSON.stringify(message));
        }
        catch (e) {
            console.log(e.message);
        }
    }
    // sends a message to the server, which sends the message to all users
    sendMessageJson(messageString){
        //console.log("Sending message to server: " + messageString)
        ws.send(messageString);
    }
    // returns whether the number specified is a valid user id
    isValidUserId(number) {
        return (number < 0);
    }
    // returns whether the number specified is your user id
    isYourUserId(number) {
        return (number === userId);
    }
    // returns your user id
    getUserId() {
        return userId;
    }
    // sets your user id
    setUserId(id) {
        userId = id;
    }
    // when the user submits their name
    submitName(name) {
        this.sendMessage("changeUsername", {username: name});
    }
}

let networking = new NetworkingObject();

// Note: https://www.youtube.com/watch?v=FduLSXEHLng was used as a basic starting point
// for adding a websocket implemntation. It is a very easy tutorial to understanding
// how to get websockets up and running on a local server
// put the URL address to the server here (with ws instead of http and wss instead of https)

//const ws = new WebSocket("ws://368d-2607-b400-26-0-8410-ccd7-64b9-639f.ngrok.io");
//const ws = new WebSocket("ws://localhost:8082");
//const ws = new WebSocket("ws://localhost:8082", "echo-protocol");
const ws = new WebSocket("ws://73.99.214.50:8082", "echo-protocol");


//your unique user id. -1 is not valid.
let userId = -1;


// when the application opens
ws.addEventListener("open", () => {
    console.log("We are connected!");
    // need to obtain user id here.
    networking.sendMessage("connecting");
    // networking.sendMessageJson("connecting");
});

// User gets a message from the server
ws.addEventListener("message", e => {
    // console.log("recieved message from server: " + e.data);
    let message;
    try {
        message = JSON.parse(e.data);
    } catch (error) {
        console.warn("unable to understand the following message data from the network: " + e);
        return;
    }

    switch (message.messageType) {
        case "connectionFailed":
            onConnectionFailed(message)
            break;
        case "userConnectedMessage":
            console.log(message.connectionMessage)
            break;
        case "connectionConfirmation":
            console.log(message.connectionMessage);
            networking.setUserId(message.userId);
            break;
        case "gameControl":
            interpretGameControlCommand(message);
            break;
        case "storyControl":
            interpretStoryControlCommand(message);
            break;
        case "refreshUsernamesList":
            updateNamesList(message);
            break;
        default:
            interpretCommand(message);
            break;
    }
});

function onConnectionFailed(message)
{
    showPage("waitingRoom");
}
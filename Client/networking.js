export {networking};
import {interpretCommand} from "./canvas.js";

class NetworkingObject {
    constructor() {
        // do nothing
    }
    // sends a message to the server, which sends the message to all users
    sendMessage(messageString){
        console.log("Sending message to server: " + messageString)
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
}

let networking = new NetworkingObject();

// Note: https://www.youtube.com/watch?v=FduLSXEHLng was used as a basic starting point
// for adding a websocket implemntation. It is a very easy tutorial to understanding
// how to get websockets up and running on a local server
// put the URL address to the server here (with ws instead of http and wss instead of https)
const ws = new WebSocket("ws://368d-2607-b400-26-0-8410-ccd7-64b9-639f.ngrok.io");

//your unique user id. -1 is not valid.
let userId = -1;


// when the application opens
ws.addEventListener("open", () => {
    console.log("We are connected!");
    // need to obtain user id here.
    networking.sendMessage("connecting");
});



// User gets a message from the server
ws.addEventListener("message", e => {
    let message;
    try {
        message = JSON.parse(e.data);
    } catch (error) {
        console.warn("unable to understand the following message data from the network: " + e);
        return;
    }

    switch (message.messageType) {
        case "userConnectedMessage":
            console.log(message.connectionMessage)
        case "connectionConfirmation":
            console.log(message.connectionMessage);
            networking.setUserId(message.userId);
            break;
        default:
            interpretCommand(message);
    }
});
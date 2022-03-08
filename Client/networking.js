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
}

let networking = new NetworkingObject();

// Note: https://www.youtube.com/watch?v=FduLSXEHLng was used as a basic starting point
// for adding a websocket implemntation. It is a very easy tutorial to understanding
// how to get websockets up and running on a local server
const ws = new WebSocket("ws://localhost:8082");

//your unique user id. -1 is not valid.
let userId = -1;


// when the application opens
ws.addEventListener("open", () => {
    console.log("We are connected!");
    // need to obtain user id here.
    networking.sendMessage("Hey, how's it going?");
});



// User gets a message from the server
ws.addEventListener("message", e => {
    let message = JSON.parse(e.data);
    console.log(message);

    console.log("Message type: " + message.messageType);
    switch (message.messageType) {
        case "userConnectedMessage":
            userId = message.userId;
        case "connectionConfirmation":
            console.log(message.connectionMessage);
            break;
        default:
            interpretCommand(message);
    }
});
// Note: https://www.youtube.com/watch?v=FduLSXEHLng was used as a basic starting point
// for adding a websocket implemntation. It is a very easy tutorial to understanding
// how to get websockets up and running on a local server
const ws = new WebSocket("ws://localhost:8082");

//your unique user index. -1 is not valid.
let user_index = -1;

ws.addEventListener("open", () => {
    console.log("We are connected!");

    ws.send("Hey, how's it going?");
});

// User gets a message from the server
ws.addEventListener("message", e => {
    let message = JSON.parse(e.data);
    console.log(message);

    console.log("Message type: " + message.messageType);
    console.log(message.connectionMessage);
});
const ws = new WebSocket("ws://localhost:8082");
ws.addEventListener("open", () => {
    console.log("We are connected!");

    ws.send("Hey, how's it going?");
});
ws.addEventListener("message", e => {
    console.log(e);
});
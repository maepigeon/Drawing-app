// basic drawing functionality starting point from:
// https://www.youtube.com/watch?v=3GqUM4mEYKA

// added:
//  (1) undo
//  (2) color selection
//  (3) eraser
//  (4) redo
//  (5) layers, needs work

let layers = [];
let activeLayerIndex = 0;

let history = [];
let undoHistory = [];

let brush = {size: 10, color: "red"};
let eraser = false;

let words = [];

import {networking} from "./networking.js"

// Interprets a message recieved from the network
// that is relevant to the canvas.
export function interpretCommand(message) {
    if (networking.isYourUserId(message.userId)) {
        return;
    }

    switch (message.messageType) {
        case "startPosition":
            startPosition(message.data);
            break;
        case "finishedPosition":
            finishedPosition(message.data);
            break;
        case "draw":
            draw(message.data);
            break;
        case "undo":
            undo();
            break;
        case "redo":
            redo();
            break;
        case "setColor":
            setColor(message.data.color)
            break;
        default:
            alert("WARNING. Unknown message sent to the canvas. Unable to interpret it. Message type: " + message.messageType + ".");
            break;
    }
}
 
/* Layers */
// creates a new layer above the layerBelow and sets it as the active layer
function createLayer(layerBelowIndex) {
    // create a new canvas for the layer
    let newCanvas = document.createElement("canvas");
    let newLayerIndex = layerBelowIndex + 1;

    // add it to the layers stack
    layers.splice(newLayerIndex, 0, newCanvas); 

    // add it to the document
    document.getElementById("layers").insertBefore(newCanvas, layers[layerBelowIndex]);
    moveLayer(layerBelowIndex, layerBelowIndex);

    // set it up
    newCanvas.style.zIndex = newLayerIndex;
    initilizeLayer(newLayerIndex)

    // make it the active layer
    setActiveLayer(newLayerIndex);
}

// initializes the resolution for a specified layer
function initilizeLayer(layerIndex) {
    let canvas = layers[layerIndex];

    // Resizing. 
    // Note: HTML canvas resolution and css div resolution 
    // are technically 2 separate properties.
    canvas.style.height = "1024px";
    canvas.style.width = "1024px";
    canvas.height = 1024;
    canvas.width = 1024; // 4MB max per layer
    saveLayerMark(layerIndex);
}
// removes the specified layer
function removeLayer(layerIndex) {
    layers.splice(layerIndex, 1);
    if (layerIndex === 0) { // this one has a white background, the other ones are transparent
        layers[0].style.backgroundColor = "white";
    }
    moveLayer(layerIndex, layerIndex); // update the z-index for each layer
}
// moves the layer to the newPosition
function moveLayer(oldPosition, newPosition) {
    let min = Math.min(oldPosition, newPosition);
    for (let i = min; i < layers.length; i++){
        layers[i].style.zIndex = i; // update the z-index for each layer
    }
}
// selects a layer for drawing on
function setActiveLayer(newLayerIndex) {
    if (newLayerIndex < 0) {
        newLayerIndex = 0;
    } else if (newLayerIndex >= layers.length) {
        newLayerIndex = layers.length - 1;
    }
    activeLayerIndex = newLayerIndex;
    let layerIndicator = document.getElementById("selected-layer-indicator");
    layerIndicator.textContent = "Selected layer index: " + String(activeLayerIndex);

    //update the new active canvas
    canvas = layers[activeLayerIndex];
    ctx = canvas.getContext("2d");

    //EventListeners
    canvas.addEventListener("pointerdown", callStartPositionAll);
    canvas.addEventListener("pointerup", callFinishedPositionAll);
    canvas.addEventListener("pointermove", callDrawAll);
    console.log(activeLayerIndex);
}
// saves the state of a layer to the history stack
function saveLayerMark(layeridx) {
    var image = layers[layeridx].toDataURL("image/png");
    undoHistory = []; // undos get overriden when a layer is saved, you can't redo when you've edited a previous state
    history.push({operation: "canvasMark", layer: layeridx, url: image});
}
// saves the fact that layers[layerIdx] was removed and its state to the history stack
function saveLayerRemove(layerIdx) {
    history.push({operation: "layerRemoved", layer: layeridx, url: image});
}
// saves the fact that layers[layerIdx] was created to the history stack
function saveLayerCreated(layerIdx) {
    history.push({operation: "layerCreated", layer: layeridx});
}
// saves the fact that a layer was moved to the history stack
function saveLayerMove(oldLayerIdx, newLayerIdx) {
    history.push({operation: "layerMoved", oldIdx: oldLayerIdx, newIdx: newLayerIdx});
}


// Calls the undo function on all the clients' canvases
function callRedoAll() {
    redo();
    let message = {
        messageType: "redo",
        userId: networking.getUserId()
    };
    networking.sendMessage(JSON.stringify(message));
}

/* Canvas operations */
// undos the last undo
function redo() {
    if (undoHistory.length === 0) {
        alert("nothing left to be redone");
        return;
    }
    let lastState = undoHistory.pop();
    history.push(lastState); // backup this redo so it can be undone
    restoreLayerState(lastState);
}



// Calls the undo function on all the clients' canvases
function callUndoAll() {
    undo();
    let message = {
        messageType: "undo",
        userId: networking.getUserId()
    };
    networking.sendMessage(JSON.stringify(message));
}
// restores the state of the canvas since the last modifying operation
function undo() {
    if (history.length <= 1) {
        alert("nothing left to undo.");
        return;
    }
    let lastState = history.pop();
    undoHistory.push(lastState); // backup this undo so it can be redone
    let operationType = lastState.operation;
    switch (operationType) {
        case "canvasMark":
            restoreLayerState(history[history.length - 1]);
            break;
        case "layerRemoved":
        case "layerMoved":
        case "layerCreated":
            break;
        default:
            break;
    }
}

// restores a specified layer state (restores a previous image of that layer)
// parameter must be of format {operation: "canvasMark", layer: layeridx, url: image}
function restoreLayerState(lastState) {
    // get url to the stored image
    let lastCanvasState = lastState.url; 

    // get the canvas to restore
    let canvas = layers[lastState.layer];
    let ctx = canvas.getContext("2d");
    ctx.globalCompositeOperation = "source-over";
    let url = lastCanvasState;

    // clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // load saved image of previous layer state
    let img = new Image; 
    img.src = url;
    img.onload = function(){
        ctx.drawImage(img,0,0); 
    };
}

// drawing functionality

//variables
let painting = false;
let canvas;
let ctx;

// Returns an object {position: {x, y}, pressure} from the event
function getPencilData(e) {
    return {position: getMousePos(canvas, e), pressure: e.pressure}
}

// when you press down the cursor
function callStartPositionAll(e) {
    let pencilData = getPencilData(e);
    startPosition(pencilData);
    let message = {
        messageType: "startPosition",
        data: pencilData,
        userId: networking.getUserId()
    };
    networking.sendMessage(JSON.stringify(message));
}
function startPosition(pencilData) {
    painting = true;
    draw(pencilData);
}
function callFinishedPositionAll(e) {
    finishedPosition();
    let message = {
        messageType: "finishedPosition",
        userId: networking.getUserId()
    };
    networking.sendMessage(JSON.stringify(message));
}

// when you release the cursor 
function finishedPosition() {
    painting = false;
    ctx.beginPath();
    saveLayerMark(activeLayerIndex);
}

// draw on everyone's canvases
function callDrawAll(e) {
    let pencilData = getPencilData(e);
    draw(pencilData);
    let message = {
        messageType: "draw",
        data: pencilData,
        userId: networking.getUserId()
    };
    networking.sendMessage(JSON.stringify(message));
}
// when the cursor moves, draw a line to the specified point if we are drawing
function draw(pencilData) {
    if (!painting) return; // don't do anything if we aren't drawing

    ctx.lineWidth = brush.size * (pencilData.pressure * 2);
    ctx.lineCap = "round";

    if (eraser) {
        ctx.globalCompositeOperation = "destination-out";
        ctx.strokeStyle = "rgba(255,255,255,1)";
    } else {
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = brush.color;
    }

    ctx.lineTo(pencilData.position.x, pencilData.position.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pencilData.position.x, pencilData.position.y);
}
// when the page is loaded, do this
window.addEventListener("load", () => {
    layers[0] = document.querySelector("#canvas");
    setActiveLayer(0);
    initilizeLayer(0);
})
// getMousePos Source: https://stackoverflow.com/a/17130415
function  getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect(), // abs. size of element
        scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for X
        scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for Y
  
    return {
      x: (evt.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
      y: (evt.clientY - rect.top) * scaleY     // been adjusted to be relative to element
    }
  }
// enables or disables eraser
function toggleEraser() {
    eraser = !eraser;
}

function setBrushThickness(size)
{
    brush.size = Math.max(5, size);
    document.getElementById("line-thickness").innerHTML = brush.size;
}

function increaseBrushThickness(amt)
{
    setBrushThickness(brush.size + amt);
}

function decreaseBrushThickness(amt)
{
    increaseBrushThickness(-amt);
}
// sets the color of the brush on all canvas instances connected to the server
function callSetColorAll(color) {
    setColor(color);

    let message = {
        messageType: "setColor",
        data: {color: color},
        userId: networking.getUserId()
    };
    networking.sendMessage(JSON.stringify(message));
}

// Sets the color of the brush for this canvas instance
function setColor(color)
{
    brush.color = color;
    eraser = false;
}

//This accesses a URL to generate a list of random words. todo: add other themes
async function getWordList() {
    const requestURL = 'https://random-word-api.herokuapp.com/word?number=250&swear=0';
    const web = new Request(requestURL);
    const response = await fetch(web);
    words = await response.json();
    let rn = Math.floor(Math.random() * words.length);
    let word = words[rn];
    document.getElementById('prompt').innerHTML = word;
}

//Generates a word
function generateWord() {
    if (words.length == 0) {
        document.getElementById('prompt').innerHTML = 'Please start game first';
    }
    else {
        let rn = Math.floor(Math.random() * words.length);
        let word = words[rn];
        document.getElementById('prompt').innerHTML = word;
    }
}

// input management (todo: clean up and add gui input)
document.addEventListener('keydown', function(event) {
    if (event.key == 'r') {
        brush.color = "red"
    } if (event.key == 'g') {
        brush.color = "green"
    } if (event.key == 'b') {
        brush.color = "blue"
    } if (event.key == 'e') {
        toggleEraser();
    } 
    if (event.key == '[')
    {
        decreaseBrushThickness(5);
    }

    if (event.key == ']')
    {
        increaseBrushThickness(5);
    }
    if (event.ctrlKey && event.key === 'z') {
        callUndoAll();
    } if (event.ctrlKey && event.key === 'y') {
        callRedoAll();
    } if (event.altKey && event.key === 'n') {
        createLayer(activeLayerIndex);
    } if (event.key == 'ArrowUp') {
        setActiveLayer(activeLayerIndex + 1);
    } if (event.key == 'ArrowDown') {
        setActiveLayer(activeLayerIndex - 1);
    } if (event.key == 'Backspace') {
        removeLayer(activeLayerIndex);
    }
});

$("#color-red").on("click", function()
{
    callSetColorAll("red");
});

$("#color-orange").on("click", function()
{
    callSetColorAll("orange");
});

$("#color-yellow").on("click", function()
{
    callSetColorAll("yellow");
});

$("#color-green").on("click", function()
{
    callSetColorAll("green");
});


$("#color-blue").on("click", function()
{
    callSetColorAll("blue");
});

$("#color-purple").on("click", function()
{
    callSetColorAll("purple");
});

$("#color-black").on("click", function()
{
    callSetColorAll("black");
});


$("#tool-erase").on("click", function()
{
    eraser = true;
});

$("#start-game-button").on("click", getWordList);
$("#end-turn-button").on("click", generateWord);
$("#tool-undo").on("click", undo);
$("#tool-redo").on("click", redo);
$("#tool-increase-thickness").on("click", function()
{
    increaseBrushThickness(5);
});
$("#tool-decrease-thickness").on("click", function()
{
    decreaseBrushThickness(5);
});


setBrushThickness(brush.size);

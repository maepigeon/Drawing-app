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
    saveLayer(layerIndex, "brush");
}
// removes the specified layer
function removeLayer(layer) {

}
// moves the layer to the newPosition
function moveLayer(layer, newPosition) {

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
    canvas.addEventListener("mousedown", startPosition);
    canvas.addEventListener("mouseup", finishedPosition);
    canvas.addEventListener("mousemove", draw);
    console.log(activeLayerIndex);
}
// saves the state of a layer to the history stack
function saveLayer(layeridx, operationName) {
    var image = layers[layeridx].toDataURL("image/png");
    undoHistory = []
    history.push({operation: operationName, layer: layeridx, url: image});
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


// restores the state of the canvas since the last modifying operation
function undo() {
    if (history.length <= 1) {
        alert("nothing left to undo.");
        return;
    }
    let lastState = history.pop();
    undoHistory.push(lastState); // backup this undo so it can be redone
    restoreLayerState(history[history.length - 1]);
}

// restores a specified layer state (restores a previous image of that layer)
// parameter must be of format {operation: operationName, layer: layeridx, url: image}
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
// when you press down the cursor
function startPosition(e) {
    painting = true;
    draw(e);
}
// when you release the cursor 
function finishedPosition() {
    painting = false;
    ctx.beginPath();
    saveLayer(activeLayerIndex, "brush");
}
// when the cursor moves, draw a line to the specified point if we are drawing
function draw(e) {
    if (!painting) return; // don't do anything if we aren't drawing

    var pos = getMousePos(canvas, e);

    ctx.lineWidth = brush.size;
    ctx.lineCap = "round";

    if (eraser) {
        ctx.globalCompositeOperation = "destination-out";
        ctx.strokeStyle = "rgba(255,255,255,1)";
    } else {
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = brush.color;
    }

    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
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
function toggle_eraser() {
    eraser = !eraser;
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
        toggle_eraser();
    } if (event.ctrlKey && event.key === 'z') {
        undo();
    } if (event.ctrlKey && event.key === 'y') {
        redo();
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
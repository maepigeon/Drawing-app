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
    canvas.addEventListener("pointerdown", startPosition);
    canvas.addEventListener("pointerup", finishedPosition);
    canvas.addEventListener("pointermove", draw);
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
// when you press down the cursor
function startPosition(e) {
    painting = true;
    draw(e);
}
// when you release the cursor 
function finishedPosition() {
    painting = false;
    ctx.beginPath();
    saveLayerMark(activeLayerIndex);
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

function increase_brush_thickness(amt)
{
    brush.size += amt;
}

function decrease_brush_thickness(amt)
{
    increase_brush_thickness(-amt);
}

function set_color(color)
{
    brush.color = color;
    eraser = false;
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
    } 
    if (event.key == '[')
    {
        decrease_brush_thickness(5);
    }

    if (event.key == ']')
    {
        increase_brush_thickness(5);
    }
    if (event.ctrlKey && event.key === 'z') {
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

document.getElementById("color-red").addEventListener("click", function()
{
    set_color("red");
});

document.getElementById("color-orange").addEventListener("click", function()
{
    set_color("orange");
});

document.getElementById("color-yellow").addEventListener("click", function()
{
    set_color("yellow");
});

document.getElementById("color-green").addEventListener("click", function()
{
    set_color("green");
});


document.getElementById("color-blue").addEventListener("click", function()
{
    set_color("blue");
});

document.getElementById("color-purple").addEventListener("click", function()
{
    set_color("purple");
});

document.getElementById("color-black").addEventListener("click", function()
{
    set_color("black");
});


document.getElementById("tool-erase").addEventListener("click", function()
{
    eraser = true;
});
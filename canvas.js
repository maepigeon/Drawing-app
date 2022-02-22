// basic drawing functionality starting point from:
// https://www.youtube.com/watch?v=3GqUM4mEYKA

// added:
//  (1) undo
//  (2) color selection
//  (3) eraser
//  (4) redo

// todo:
// pressure
// catmull-rom based smoothing
// size/color selectors
// syncing using websockets and a webserver
// gui


let layers = [];
let history = [];
let undoHistory = [];

let brush = {size: 10, color: "red"};

let eraser = false;

// saves the state of a layer to the history stack
function saveLayer(layeridx, operationName) {
    var image = layers[0].toDataURL("image/png");
    undoHistory = []
    history.push({operation: operationName, layer: layeridx, url: image});
}

// undos the last undo
function redo() {
    if (undoHistory.length === 0) {
        alert("nothing left to be redone");
        return;
    }
    var lastState = undoHistory.pop();
    history.push(lastState); // backup this redo so it can be undone

    var lastCanvasState = lastState.url; // url to the stored image
    var canvas = layers[0];
    var ctx = canvas.getContext("2d");
    ctx.globalCompositeOperation = "source-over";
    var url = lastCanvasState;

    ctx.clearRect(0, 0, canvas.width, canvas.height); // clear canvas

    var img = new Image; // load saved image of previous layer state
    img.src = url;
    img.onload = function(){
        ctx.drawImage(img,0,0); 
    };
}


// restores the state of the canvas since the last modifying operation
function undo() {
    if (history.length === 0) {
        alert("nothing left to undo.");
        return;
    }
    var lastState = history.pop();
    undoHistory.push(lastState); // backup this undo so it can be redone

    var lastCanvasState = history[history.length - 1].url; // get url to the stored image
    var canvas = layers[0];
    var ctx = canvas.getContext("2d");
    ctx.globalCompositeOperation = "source-over";
    var url = lastCanvasState;

    ctx.clearRect(0, 0, canvas.width, canvas.height); // clear canvas

    var img = new Image; // load saved image of previous layer state
    img.src = url;
    img.onload = function(){
        ctx.drawImage(img,0,0); 
    };
}

window.addEventListener("load", () => {
    layers[0] = document.querySelector("#canvas");
    var canvas = layers[0]
    const ctx = canvas.getContext("2d");
    saveLayer(0, "brush");


    // Resizing. 
    // Note: HTML canvas resolution and css div resolution 
    // are technically 2 separate properties.
    canvas.style.height = "1024px";
    canvas.style.width = "1024px";
    canvas.height = 1024;
    canvas.width = 1024; // 4MB max per layer

    //variables
    let painting = false;

    // when you press down the cursor
    function startPosition(e) {
        painting = true;
        draw(e);
    }

    // when you release the cursor 
    function finishedPosition() {
        painting = false;
        ctx.beginPath();
        saveLayer(0, "brush");
    }

    // when the cursor moves
    function draw(e) {
        var pos = getMousePos(canvas, e);

        if (!painting) return;
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

    //EventListeners
    canvas.addEventListener("mousedown", startPosition);
    canvas.addEventListener("mouseup", finishedPosition);
    canvas.addEventListener("mousemove", draw);
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
    } 
  });


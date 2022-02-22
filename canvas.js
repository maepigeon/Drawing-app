// drawing functionality starting point from:
// https://www.youtube.com/watch?v=3GqUM4mEYKA

// added:
//  (1) undo
//  (2) color selection
//  (3) eraser

// todo:
// pressure
// catmull-rom based smoothing
// size/color selectors
// syncing using websockets and a webserver


let layers = []
let undoHistory = []
let numberOfUndos = 0

let brush = {size: 10, color: "red"}

let eraser = false

// saves the state of a layer to the history stack
function saveLayer(layeridx, operationName) {
    numberOfUndos = 0;
    var image = layers[0].toDataURL("image/png");
    undoHistory.push({operation: operationName, layer: layeridx, url: image});
}

// restores the state of the canvas since the last modifying operation
function undo() {
    var lastCanvasState = undoHistory.pop().url;
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
    numberOfUndos++;
}

window.addEventListener("load", () => {
    layers[0] = document.querySelector("#canvas");
    var canvas = layers[0]
    const ctx = canvas.getContext("2d");

    // Resizing
    canvas.height = 1000;
    canvas.width = 1000;
    //canvas.height = window.innerHeight  * 2 / 3;
    //canvas.width = window.innerHeight * 2 / 3;

    //variables
    let painting = false;

    function startPosition(e) {
        saveLayer(0, "brush");

        painting = true;
        draw(e);
    }
    function finishedPosition() {
        painting = false;
        ctx.beginPath();
    }

    function draw(e) {
        var pos = getMousePos(canvas, e)

        
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
    if (event.ctrlKey && event.key === 'z') {
      undo();
    }
  });


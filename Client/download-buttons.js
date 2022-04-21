
// Downloads the canvas
$("#download-canvas-button").on("click", function()
{
    downloadCanvas();
});

// Source for this function is from stackoverflow https://stackoverflow.com/a/50300880
var downloadCanvas = function(){
    var link = document.createElement('a');
    link.download = 'canvas.png';
    link.href = document.getElementById('canvas').toDataURL()
    link.click();
  }

$("#download-story-button").on("click", function()
{
    downloadStory("story.txt", $("#story-box").text());
});

function downloadStory(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
  }
  
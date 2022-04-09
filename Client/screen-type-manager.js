document.addEventListener('keydown', function(event) {
    if (event.key == '-') {
        showPage("enterName")
    } if (event.key == '=') {
        showPage("drawingMode");
    } 
});


function createEnterNamePopup() {
    if (document.getElementById("enterNameBox")) {
        return;
    }
    var div = document.createElement('div');
    div.id = "enterNameBox";
    let htmlText =
        '<br><br><br>' +
        '<form">' +
            '<label for="enterName">Type your name: </label>' +
            '<input type="text" id="enterName" name="playerName"><br>' +
            '<button type="button">Submit</button>'
        '</form>'
    div.innerHTML = htmlText.trim();
    document.getElementById('middle').append(div);
}
function deleteEnterNamePopup() {
    document.getElementById("enterNameBox").remove();
}


// shows the relevant page: [drawingMode, enterName]
function showPage(pageName) {
    switch (pageName) {
        case "enterName":
            createEnterNamePopup();
            showCanvasFeatures(false);
            break;
        case "drawingMode":
        default:
            showCanvasFeatures(true);
            try {
                deleteEnterNamePopup();
            } catch (e) {
                // do nothing
            }

            break;
    }
}
showPage("drawingMode");


// Hide the canvas
function showCanvasFeatures(visible) {
    toggleVisible("#layers", visible);
    toggleVisible("#story-container", visible);
    toggleVisible("#tools", visible);
    toggleVisible("#prompt-container", visible);
    toggleVisible("#title-container", visible);
    toggleVisible("#game-controls", visible);
    toggleVisible("#story-input-container", visible);

}

function toggleVisible(element, visible)
{
    if (visible)
    {
        $(element).removeClass("hidden");
    }
    else
    {
        $(element).addClass("hidden");
    }
}

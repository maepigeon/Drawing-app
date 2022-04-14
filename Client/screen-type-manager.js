import {networking} from "./networking.js"
// Window manager that loads/unloads pages without needing to refresh the page.

// Each user should enter their name when they join.
let currentPage = "";
showPage("enterName");

// Developer shortcuts to enter each page on commang
/*document.addEventListener('keydown', function(event) {
    if (event.key == '-') {
        showPage("enterName")
    } if (event.key == '=') {
        showPage("drawingMode");
    } 
});*/

// Creates an enter name box and adds it to the window.
function createEnterNameBox() {
    var div = document.createElement('div');
    div.id = "enterNameBox";
    let htmlText =
        '<br><br><br>' +
        '<form">' +
            '<label for="enterName" id="enter-name-text">Type your name: </label>' +
            '<input type="text" id="enter-name-field" name="playerName"><br>' +
            '<button type="button" class="game-button" id="enter-name-button">Submit</button>'
        '</form>'
    div.innerHTML = htmlText.trim();
    document.getElementById('middle').append(div);

    $("#enter-name-button").on("click", () =>
    {
        let playerName = $("#enter-name-field").val();
        if (playerName.length < 3) {
            window.alert("Your username must be at least 3 characters long. Please try again.");
        } else {
            networking.submitName(playerName);
            showPage("drawingMode");
        }
    });
}
// Removes and deletes the enter name box from the window.
function deleteEnterNameBox() {
    document.getElementById("enterNameBox").remove();
}


// shows the relevant page: [drawingMode, enterName]
export function showPage(pageName) {
    // No need to show a page if it is already there.
    if (pageName === currentPage) {
        console.log("Attempted to load a page that was already loaded: " + currentPage);
        return;
    }

    // Removes the old page from the window.
    switch (currentPage) {
        case "enterName":
            deleteEnterNameBox();
            break;
        case "drawingMode":
            showCanvasFeatures(false);
            break;
        default:
            break;
    }

    currentPage = pageName;

    // Adds the new page to the window.
    switch (pageName) {
        case "enterName":
            createEnterNameBox();
            showCanvasFeatures(false);
            break;
        case "drawingMode":
            showCanvasFeatures(true);
            break;
        default:
            console.log("Attempted to load an invalid page name: " + pageName);
            break;
    }
}


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

// Toggles the visibility of an element
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
import {networking} from "./networking.js"
import {setCanvasEnabled} from "./canvas.js"

// Window manager that loads/unloads pages without needing to refresh the page.

// Each user should enter their name when they join.
let currentPage = "drawingMode";
showPage("enterName");

// Developer shortcuts to enter each page on commang
document.addEventListener('keydown', function(event) {
    if (event.key == '-') {
        showPage("enterName")
    } if (event.key == '=') {
        showPage("drawingMode");
    } if (event.key == '0') {
        showPage("endGame");
    }
});

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
            $("#title-container").addClass("hidden");
            showCanvasFeatures(false);
            setCanvasEnabled(false);
            break;
        case "endGame":
            deleteEndGameScreen();
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
            $("#title-container").removeClass("hidden");
            showCanvasFeatures(true);
            setCanvasEnabled(true);
            break;
        case "endGame":
            showCanvasFeatures(true);
            createEndGameScreen();
            break;
        default:
            console.log("Attempted to load an invalid page name: " + pageName);
            break;
    }
}

// Creates the end game screen
function createEndGameScreen() {
    $("#app-layout").addClass("end-game");
    $("#canvas").addClass("end-game");
    $("#players-container").addClass("hidden");
    $("#prompt-container").addClass("hidden");
    $("#title-container").addClass("hidden");
    $("#timer-container").addClass("hidden");
    $("#tools").addClass("hidden");
    $("#rating").addClass("hidden");
    $("#story-input-container").addClass("hidden");
    $("#game-controls").addClass("hidden");
    $("#download-canvas").removeClass("hidden");
    $("#download-story").removeClass("hidden");

    $("#title").text("DoodlLab");


    //rearrange
    $("#left").attr("id", "temp-middle");
    $("#middle").attr("id", "left");
    $("#temp-middle").attr("id", "middle");
    $('#left').insertBefore('#middle');
}

// Deletes the end game screen
function deleteEndGameScreen() {
    $("#app-layout").removeClass("end-game");
    $("#canvas").removeClass("end-game");
    $("#players-container").removeClass("hidden");
    $("#prompt-container").removeClass("hidden");
    $("#title-container").removeClass("hidden");
    $("#timer-container").removeClass("hidden");
    $("#tools").removeClass("hidden");
    $("#rating").removeClass("hidden");
    $("#story-input-container").removeClass("hidden");
    $("#game-controls").removeClass("hidden");
    $("#download-canvas").addClass("hidden");
    $("#download-story").addClass("hidden");

    $("#title").text("No active game. Click Start Game to begin a game.");

    //rearrange
    $("#left").attr("id", "temp-middle");
    $("#middle").attr("id", "left");
    $("#temp-middle").attr("id", "middle");
    $('#left').insertBefore('#middle');

}


// Hide the canvas
function showCanvasFeatures(visible) {
    toggleVisible("#layers", visible);
    toggleVisible("#story-container", visible);
    toggleVisible("#tools", visible);
    toggleVisible("#prompt-container", visible);
    toggleVisible("#title-container", visible);
    toggleVisible("#game-controls", visible);

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
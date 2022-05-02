import {networking} from "./networking.js"
import {setCanvasEnabled} from "./canvas.js"
import {getWordList, setThemeForAll} from "./WordGenerator.js"
import {initiateGameForAll} from "./game-control-client.js"
import {getMVPArtist} from "./game-control-client.js"

// Window manager that loads/unloads pages without needing to refresh the page.


// Creates a waiting room message.
function createWaitingRoomMessage() {
    var div = document.createElement('div');
    div.id = "waiting-room-container";
    let htmlText =
        '<h1 id = "logo-title">DoodlLab</h1>' +
        '<br>' +
        '<h1>There is a game currently ongoing. Please check back later to join the game.</h1>'
    div.innerHTML = htmlText.trim();
    document.getElementById('middle').append(div);
    $("#instructions-container").removeClass("hidden");
    $("#players-container").addClass("hidden");
}

// Removes and deletes the waiting room message
function deleteWaitingRoomMessage() {
    document.getElementById("waiting-room-container").remove();
    $("#players-container").removeClass("hidden");

}

// Creates an enter name box and adds it to the window.
function createEnterNameBox() {
    var div = document.createElement('div');
    div.id = "enterNameBox";
    let htmlText =
        '<h1 id = "logo-title">DoodlLab</h1>' +
        '<br>' +
        '<form class="grid-box" style="padding: 20px 30px 30px;">' +
            '<label for="enterName" id="enter-name-text">Type your name: </label><br/>' +
            '<input type="text" id="enter-name-field" name="playerName"><br>' +
            '<button type="button" class="game-button download" id="enter-name-button">Start</button>'
        '</form>'
    div.innerHTML = htmlText.trim();
    document.getElementById('middle').append(div);
    $("#instructions-container").removeClass("hidden");

    $("#enter-name-button").on("click", () =>
    {
        let playerName = $("#enter-name-field").val();
        if (playerName.length < 1) {
            window.alert("Your username must be at least 1 character long. Please try again.");
        } else {
            networking.submitName(playerName);
            showPage("drawingMode");
        }
    });
}
// Removes and deletes the enter name box from the window.
function deleteEnterNameBox() {
    document.getElementById("enterNameBox").remove();
    $("#instructions-container").addClass("hidden");
}


// shows the relevant page: [drawingMode, enterName, endGame]
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
        case "waitingRoom":
            deleteWaitingRoomMessage();
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
        case "waitingRoom":
            createWaitingRoomMessage();
            break;
        default:
            console.log("Attempted to load an invalid page name: " + pageName);
            break;
    }
}
//adds theme screen

function createThemeScreen() {
    $("#theme-button").removeClass("hidden");
    toggleVisible("#rating", false);
    toggleVisible("#story-input-container", false);
    toggleVisible("#turn-container", false);
    showCanvasFeatures(false);
    $("#nature-button").on("click", () =>
    {
        setThemeForAll(1);
        deleteThemeScreen();
        initiateGameForAll();
    });
    $("#food-button").on("click", () =>
    {
        setThemeForAll(2);
        deleteThemeScreen();
        initiateGameForAll();
    });
    $("#spooky-button").on("click", () =>
    {
        setThemeForAll(3);
        deleteThemeScreen();
        initiateGameForAll();
    });
    $("#random-button").on("click", () =>
    {
        setThemeForAll(4);
        deleteThemeScreen();
        initiateGameForAll();
    });
}
//removes theme screen
export function deleteThemeScreen() {
    $("#theme-button").addClass("hidden");
    showCanvas(true);
}

// Creates the end game screen
function createEndGameScreen() {
    $("#app-layout").addClass("end-game");
    $("#canvas").addClass("end-game");
    $("#players-container").addClass("hidden");
    $("#prompt-container").addClass("hidden");
    // $("#title-container").addClass("hidden");
    $("#timer-container").addClass("hidden");
    $("#tools").addClass("hidden");
    $("#rating").addClass("hidden");
    $("#story-input-container").addClass("hidden");
    $("#game-controls").addClass("hidden");
    $("#turn-container").addClass("hidden");

    $("#mvp-container").removeClass("hidden");

    $("#download-canvas").removeClass("hidden");
    $("#download-story").removeClass("hidden");

    $("#title").text("Game Over!");


    //rearrange
    // $("#left").attr("id", "temp-middle");
    // $("#middle").attr("id", "left");
    // $("#temp-middle").attr("id", "middle");
    // $("#left").insertBefore("#middle");
    $("#mvp-artist-name").text(getMVPArtist());
}

// Deletes the end game screen
function deleteEndGameScreen() {
    $("#app-layout").removeClass("end-game");
    $("#canvas").removeClass("end-game");
    $("#players-container").removeClass("hidden");
    $("#prompt-container").removeClass("hidden");
    // $("#title-container").removeClass("hidden");
    $("#timer-container").removeClass("hidden");
    $("#tools").removeClass("hidden");
    $("#rating").removeClass("hidden");
    $("#story-input-container").removeClass("hidden");
    $("#turn-container").removeClass("hidden");

    $("#mvp-container").addClass("hidden");


    $("#game-controls").removeClass("hidden");
    $("#download-canvas").addClass("hidden");
    $("#download-story").addClass("hidden");

    $("#title").text("No active game. Click Start Game to begin a game.");


    //rearrange
    // $("#left").attr("id", "temp-middle");
    // $("#middle").attr("id", "left");
    // $("#temp-middle").attr("id", "middle");
    // $('#left').insertBefore('#middle');
}

function showCanvas(visible)
{
    toggleVisible("#prompt-container", visible);
    toggleVisible("#title-container", visible);
    toggleVisible("#layers", visible);
    toggleVisible("#story-container", visible);
    toggleVisible("#game-controls", visible);
    toggleVisible("#timer-container", visible);
    toggleVisible("#turn-container", visible);

}

// Hide the canvas
function showCanvasFeatures(visible) {
    showCanvas(visible);
    toggleVisible("#tools", visible);

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


let currentPage = "drawingMode";
$ (function ()
{
    $("#start-game-button").on("click", createThemeScreen);
    $("#new-game-button").on("click", function()
    {
        showPage("drawingMode");
        createThemeScreen();
    });
    $("#end-game-button").on("click", function ()
    {
        showPage("endGame");
    });
    
    // Each user should enter their name when they join.
    showPage("enterName");

    /*
    // Developer shortcuts to enter each page on commang
    document.addEventListener('keydown', function(event) {
        if (event.key == '-') {
            showPage("enterName")
        } if (event.key == '=') {
            showPage("drawingMode");
        } if (event.key == '0') {
            showPage("endGame");
        }
    });*/
    
});

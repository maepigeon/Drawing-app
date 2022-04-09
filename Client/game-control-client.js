import {getWordList} from "./WordGenerator.js";
import {generateWord} from "./WordGenerator.js";
import {networking} from "./networking.js";
import { setDrawingEnabled } from "./canvas.js";
import { clearCanvas } from "./canvas.js";
import { resetStory, setStoryWritingEnabled } from "./story-control-client.js";
import { ClientGameState } from "./client-game-state.js";

let currentPlayerTurn = 0;

export function interpretGameControlCommand(message)
{
    let eventType = message.eventType;
    console.log("interpreting game event: " + eventType);
    switch (eventType)
    {
        case "gameStart":
            console.log("Game starting!");
            // ClientGameState.updateGameState(ClientGameState.PlayerTurn);
            onGameStart();
            break;
        case "turnStart":
            console.log("Turn starting! It's player " + message.playerTurn + "'s turn");
            currentPlayerTurn = message.playerTurn;
            // onTurnStart(message.playerTurn);
            break;
        case "gameEnd":
            // onGameEnd();
            break;
    }
}

addEventListener(ClientGameState.OnGameStateChanged, (e) =>
{
    console.log("game state changed");
    switch (ClientGameState.currentGameState) {
        case ClientGameState.PlayerTurn:
            onMyTurn(currentPlayerTurn);
            break;
        case ClientGameState.OtherPlayerTurn:
            onOtherPlayerTurn(currentPlayerTurn);
            break;
        case ClientGameState.GameOver:
            onGameEnd();
            break;
        default:
            break;
    }
});

function onGameStart()
{
    console.log("game start");
    $("#start-game-button").addClass("hidden");
    $("#new-game-button").addClass("hidden");
    clearCanvas();
    resetStory();
    getWordList();
}

function onGameEnd()
{
    console.log("game end")
    setDrawingEnabled(false);
    $("#new-game-button").removeClass("hidden");
    $("#title").text("Game over!");

}

// function onTurnEnd()
// {
//     console.log("turn end");
//     generateWord();
//     $("#end-turn-button").addClass("hidden");
// }

function onTurnStart(turn)
{
    generateWord();
    if (turn == networking.getUserId())
    {
        onMyTurn(turn);
    }
    else
    {
        onOtherPlayerTurn(turn);
    }

}

function onMyTurn(playerId)
{
    console.log("My turn!");
    setDrawingEnabled(true);
    $("#end-turn-button").removeClass("hidden");
    $("#prompt-container").removeClass("hidden");
    $("#tools").removeClass("hidden");
    $("#rating").addClass("hidden");
    $("#title").text("It's your turn to draw!");
    setStoryWritingEnabled(false);
    ClientGameState.currentGameState = ClientGameState.onMyTurn;
}

function onOtherPlayerTurn(playerId)
{
    $("#title").text("It's Player " + (playerId + 1) + "'s turn to draw!");
    $("#prompt-container").addClass("hidden");
    $("#tools").addClass("hidden");
    $("#rating").removeClass("hidden");
    console.log("It's not my turn!");
    setDrawingEnabled(false);
    setStoryWritingEnabled(true);
    ClientGameState.currentGameState = ClientGameState.onOtherPlayerTurn;

}

function initiateGameForAll()
{
    networking.sendMessage(
        "gameControl", 
        {
            "event": "gameStart", 
            "turnsPerPlayer": 3
        }
    );
    // game.onGameStart();
}

$ (function ()
{
    

    // $("#start-game-button").on("click", getWordList);
    //for now, turns per player is hardcoded to 3
    //TODO: make turns per player specified by the players in the game
    $("#start-game-button").on("click", () => {
        console.log("clicked game start");
        initiateGameForAll();
    });
    $("#new-game-button").on("click", () => {
        console.log("clicked new game");
        initiateGameForAll();
    });
    $("#end-turn-button").on("click", () => {
        networking.sendMessage("gameControl", {"event": "turnEnd"});
        $("#end-turn-button").addClass("hidden");
        // game.onTurnEnd();
    });
    $("#end-game-button").on("click", () =>
    {
        // game.onGameEnd();
    });

});
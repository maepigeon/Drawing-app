import {getWordList} from "./WordGenerator.js";
import {generateWord} from "./WordGenerator.js";
import {networking} from "./networking.js";
import { setDrawingEnabled } from "./canvas.js";
import { clearCanvas } from "./canvas.js";


export function interpretGameControlCommand(message)
{
    let eventType = message.eventType;
    console.log("interpreting game event: " + eventType);
    switch (eventType)
    {
        case "gameStart":
            console.log("Game starting!");
            onGameStart();
            break;
        case "turnStart":
            console.log("Turn starting! It's player " + message.playerTurn + "'s turn");
            onTurnStart(message.playerTurn);
            break;
        case "gameEnd":
            onGameEnd();
            break;
    }
}

function onGameStart()
{
    console.log("game start");
    $("#start-game-button").addClass("hidden");
    $("#new-game-button").addClass("hidden");
    clearCanvas();
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
        console.log("My turn!");
        setDrawingEnabled(true);
        $("#end-turn-button").removeClass("hidden");
        $("#prompt-container").removeClass("hidden");

        $("#title").text("It's your turn to draw!");

    }
    else
    {
        $("#title").text("It's Player " + (turn + 1) + "'s turn to draw!");
        $("#prompt-container").addClass("hidden");
        console.log("It's not my turn!");
        setDrawingEnabled(false);
    }

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
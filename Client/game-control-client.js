import {getWordList} from "./WordGenerator.js";
import {generateWord} from "./WordGenerator.js";
import {networking} from "./networking.js";
import { setDrawingEnabled } from "./canvas.js";
import { clearCanvas } from "./canvas.js";
import { resetStory, resetVotes, setStoryWritingEnabled } from "./story-control-client.js";


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
        case "updateScores":
            updateScores(message.scores);
            break;
    }
}

function updateScores(scores)
{
    console.log(scores);
    let myScore = scores.find(e => e.playerId == networking.getUserId());
    $("#score").text(myScore.score);

}

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
        onMyTurn();
    }
    else
    {
        onOtherPlayerTurn(turn);
    }

}

function onMyTurn()
{
    console.log("My turn!");
    setDrawingEnabled(true);
    $("#end-turn-button").removeClass("hidden");
    $("#prompt").removeClass("hidden");
    $("#prompt-text").css("color", "#000000");
    $("#tools").removeClass("hidden");
    $("#rating").addClass("hidden");
    $("#title").text("It's your turn to draw!");
    setStoryWritingEnabled(false);
}

function onOtherPlayerTurn(playerId)
{
    $("#title").text("It's Player " + (playerId + 1) + "'s turn to draw!");
    $("#prompt").addClass("hidden");
    $("#prompt-text").css("color", "#00000000");
    $("#tools").addClass("hidden");
    $("#rating").removeClass("hidden");
    console.log("It's not my turn!");
    setDrawingEnabled(false);
    setStoryWritingEnabled(true);
    resetVotes();
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

function submitRating(rating)
{
    networking.sendMessage(
        "gameControl",
        {
            "event": "rateDrawing",
            "rating": rating
        }
    );
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

    $("#rating-button-1").on("click", () => {
        submitRating(1);
    });
    $("#rating-button-2").on("click", () => {
        submitRating(2);
    });
    $("#rating-button-3").on("click", () => {
        submitRating(3);
    });
    $("#rating-button-4").on("click", () => {
        submitRating(4);
    });
    $("#rating-button-5").on("click", () => {
        submitRating(5);
    });

});
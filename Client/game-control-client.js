import {getWordList} from "./WordGenerator.js";
import {generateWord} from "./WordGenerator.js";
import {networking} from "./networking.js";
import { setDrawingEnabled } from "./canvas.js";
import { clearCanvas } from "./canvas.js";
import { resetStory, resetVotes, setStoryWritingEnabled } from "./story-control-client.js";
import { Timer } from "./timer.js";

let drawTimer = new Timer();
drawTimer.onTimerFinished = () =>
{
    if (isMyTurn)
    {
        endTurn();
    }
}
let isMyTurn = false;

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
            console.log("Turn starting! It's player " + message.player.id + "'s turn");
            onTurnStart(message.player);
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
    for (let i = 0; i < scores.length; i++)
    {
        $("#player-" + i + "-scorebox").text(scores[i].score);
    }

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
    drawTimer.cancelTimer();

}

// function onTurnEnd()
// {
//     console.log("turn end");
//     generateWord();
//     $("#end-turn-button").addClass("hidden");
// }

function onTurnStart(player)
{
    generateWord();
    if (player.id == networking.getUserId())
    {
        onMyTurn();
    }
    else
    {
        onOtherPlayerTurn(player);
    }
    drawTimer.startTimer(6000000);

}

function onMyTurn()
{
    isMyTurn = true;
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

function onOtherPlayerTurn(player)
{
    isMyTurn = false;
    $("#title").text("It's " + player.name + "'s turn to draw!");
    $("#prompt").addClass("hidden");
    $("#prompt-text").css("color", "#00000000");
    $("#tools").addClass("hidden");
    $("#rating").removeClass("hidden");
    console.log("It's not my turn!");
    setDrawingEnabled(false);
    setStoryWritingEnabled(true);
    resetVotes();
    selectRating(3);
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

function deselectRatings()
{
    for (let i = 1; i <= 5; i++)
    {
        $("#rating-button-" + i).removeClass("selected");
    }
}

function selectRating(rating)
{
    deselectRatings();
    $("#rating-button-" + rating).addClass("selected");
    submitRating(rating);
}

function endTurn()
{
    networking.sendMessage("gameControl", {"event": "turnEnd"});
    $("#end-turn-button").addClass("hidden");
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
        endTurn();
    });

    $("#rating-button-1").on("click", () => {
        selectRating(1);
    });
    $("#rating-button-2").on("click", () => {
        selectRating(2);
    });
    $("#rating-button-3").on("click", () => {
        selectRating(3);
    });
    $("#rating-button-4").on("click", () => {
        selectRating(4);
    });
    $("#rating-button-5").on("click", () => {
        selectRating(5);
    });

});
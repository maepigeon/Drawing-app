import {getWordList} from "./WordGenerator.js";
import {generateWord} from "./WordGenerator.js";
import {networking} from "./networking.js";
import { callSetColorAll, setDrawingEnabled } from "./canvas.js";
import { clearCanvas } from "./canvas.js";
import { resetStory, resetVotes, setStoryVotingEnabled, setStoryWritingEnabled } from "./story-control-client.js";
import { Timer } from "./timer.js";

let drawTimer = new Timer();
drawTimer.onTimerFinished = () =>
{
    if (isMyTurn && isDrawPhase)
    {
        endTurn();
    }
}
drawTimer.onTimerFinished;
let isMyTurn = false;
let isDrawPhase = false;

export function interpretGameControlCommand(message)
{
    let eventType = message.eventType;
    console.log("interpreting game event: " + eventType);
    switch (eventType)
    {
        case "gameStart":
            console.log("Game starting!");
            onGameStart(message.totalTurns);
            break;
        case "turnStart":
            console.log("Turn starting! It's player " + message.player.id + "'s turn");
            onTurnStart(message.player, message.turnNumber);
            break;
        case "gameEnd":
            onGameEnd();
            break;
        case "updateScores":
            updateScores(message.scores);
            break;
        case "storySubmitPhaseStart":
            storySubmitPhaseStart(message.duration);
            break;
        case "storySubmitPhaseEnd":
            storySubmitPhaseEnd();
            break;
        case "storyVotePhaseStart":
            storyVotePhaseStart(message.duration);
            break;
        case "storyVotePhaseEnd":
            storyVotePhaseEnd();
            break;
        case "setTheme":
            setTheme(message.theme);
            break;

    }
}

function setTheme(theme)
{
    getWordList(theme);
}

function storySubmitPhaseStart(duration)
{
    drawTimer.startTimer(duration);
    if (isMyTurn)
    {
        $("#title").text("Wait while the other players finish writing additions to the story!");

    }
    else
    {
        $("#title").text("Finish writing your story submission!");
    }
}

function storySubmitPhaseEnd()
{
    
}

function storyVotePhaseStart(duration)
{

    drawTimer.startTimer(duration);
    $("#title").text("Vote for your favorite story submissions!");
    setStoryVotingEnabled(true);
    setStoryWritingEnabled(false);
    resetVotes();


}

function storyVotePhaseEnd()
{

}

function updateScores(scores)
{
    for (let i = 0; i < scores.length; i++)
    {
        $("#player-" + i + "-scorebox").text(scores[i].score);
    }

}

function onGameStart(numTurns)
{
    console.log("game start");
    $("#start-game-button").addClass("hidden");
    $("#new-game-button").addClass("hidden");
    clearCanvas();
    resetStory();
    // getWordList();
    $("#total-turn-number").text(numTurns);
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

function onTurnStart(player, turn)
{
    generateWord();
    isDrawPhase = true;
    if (player.id == networking.getUserId())
    {
        onMyTurn();
    }
    else
    {
        onOtherPlayerTurn(player);
    }
    drawTimer.startTimer(60);
    $("#turn-number").text(turn + 1);

}

function onMyTurn()
{
    isMyTurn = true;
    console.log("My turn!");
    setDrawingEnabled(true);
    $("#end-turn-button").removeClass("hidden");
    $("#prompt").removeClass("hidden");
    $("#prompt-text").css("color", "#000000");
    // $("#tools").removeClass("hidden");
    $("#rating").addClass("hidden");
    $("#title").text("It's your turn to draw!");
    setStoryWritingEnabled(false);
    setStoryVotingEnabled(false);
    $("#color-black").trigger("click");
}

function onOtherPlayerTurn(player)
{
    isMyTurn = false;
    $("#title").text("It's " + player.name + "'s turn to draw!");
    $("#prompt").addClass("hidden");
    $("#prompt-text").css("color", "#00000000");
    // $("#tools").addClass("hidden");
    $("#rating").removeClass("hidden");
    console.log("It's not my turn!");
    setDrawingEnabled(false);
    setStoryWritingEnabled(true);
    selectRating(3);

    setStoryVotingEnabled(false);
    setStoryWritingEnabled(true);
}

export function initiateGameForAll()
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
    setDrawingEnabled(false);
    // isMyTurn = false;
    isDrawPhase = false;
    drawTimer.cancelTimer();
}

$ (function ()
{
    

    // $("#start-game-button").on("click", getWordList);
    //for now, turns per player is hardcoded to 3
    //TODO: make turns per player specified by the players in the game
    // $("#start-game-button").on("click", () => {
    //     console.log("clicked game start");
    //     initiateGameForAll();
    // });
    $("#new-game-button").on("click", () => {
        console.log("clicked new game");
        initiateGameForAll();
    });
    $("#end-game-button").on("click", () => {
        console.log("clicked new game");
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
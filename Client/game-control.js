
import { GameManager } from "./GameManager.js";
import {getWordList} from "./WordGenerator.js";
import {generateWord} from "./WordGenerator.js";
import {networking} from "./networking.js";

let game;

export function interpretGameControlCommand(message)
{
    let eventType = message.data.event;
    console.log("interpreting game event: " + eventType);
    switch (eventType)
    {
        case "gameStart":
            console.log("game start recieved!");
            intializeGame();
            game.onGameStart();
            break;
    }
}

function intializeGame(numPlayers)
{
    game = new GameManager(networking.usersConnected)
}

function onGameStart()
{
    console.log("game start");
    getWordList();
}

function onGameEnd()
{
    console.log("game end")
    
}

function onTurnEnd()
{
    console.log("turn end");
    generateWord();

}

function onTurnStart()
{
    console.log("turn start");

}

$ (function ()
{
    

    // $("#start-game-button").on("click", getWordList);
    $("#start-game-button").on("click", () => {
        console.log("clicked game start");
        networking.sendMessage("gameControl", {"event": "gameStart"});
        // game.onGameStart();
    });
    $("#end-turn-button").on("click", () => {
        // game.onTurnEnd();
    });
    $("#end-game-button").on("click", () =>
    {
        // game.onGameEnd();
    });

});
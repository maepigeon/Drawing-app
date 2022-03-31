
import { GameManager } from "./GameManager.js";
import {getWordList} from "./WordGenerator.js";
import {generateWord} from "./WordGenerator.js";
import {networking} from "./networking.js";

export function interpretGameControlCommand(message)
{
    let eventType = message.data.event;
    console.log("interpreting game event: " + eventType);
    switch (eventType)
    {
        case "gameStart":
            console.log("game start recieved!");
            game.onGameStart();
            break;
    }
}


let game = new GameManager(1, 5);
game.onGameStart = function()
{
    console.log("game start");
    getWordList();
}
game.onGameEnd = function()
{
    console.log("game end")
}
game.onTurnEnd = function()
{
    console.log("turn end");
    generateWord();
}
game.onTurnStart = function()
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
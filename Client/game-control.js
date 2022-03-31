
import { GameManager } from "./GameManager.js";
import {getWordList} from "./WordGenerator.js";
import {generateWord} from "./WordGenerator.js";

$ (function ()
{
    
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

    // $("#start-game-button").on("click", getWordList);
    $("#start-game-button").on("click", () => {
        game.onGameStart();
    });
    $("#end-turn-button").on("click", () => {
        game.onTurnEnd();
    });
    $("#end-game-button").on("click", () =>
    {
        game.onGameEnd();
    });

});
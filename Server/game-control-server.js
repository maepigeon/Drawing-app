let server;
let gameManager;

function interpretGameControlCommand(player, message)
{
    let eventType = message.data.event;
    console.log("interpreting game event: " + eventType);
    switch (eventType)
    {
        case "gameStart":
            initializeGame(message.data.turnsPerPlayer);
            gameManager.startGame();
            break;
        // case "turnStart":
        //     gameManager.startTurn();
        //     break;
        case "turnEnd":
            gameManager.endTurnDrawing();
            break;
    }
}


function initializeGame(turnsPerPlayer)
{
    server = require("./index.js");
    gameManager = new GameManager(server.connected_client_sockets.length, turnsPerPlayer);
    gameManager.onGameStart = () => startGame();
    gameManager.onTurnDrawingStart = () => startTurn();
    gameManager.onTurnDrawingEnd = () => endTurn();
    gameManager.onGameEnd = () => endGame();
}


function startGame()
{
    server.send_data_to_all_clients(
        {
            "messageType":"gameControl",
            "eventType":"gameStart",
        }
    );
}

function startTurn()
{
    console.log(gameManager);
    console.log("current player is " + gameManager.currentPlayer);
    server.send_data_to_all_clients(
        {
            "messageType":"gameControl",
            "eventType":"turnStart",
            "playerTurn":server.connected_client_sockets[gameManager.currentPlayer].id
        }
    );
}

function endTurn()
{
    server.send_data_to_all_clients(
        {
            "messageType":"gameControl",
            "eventType":"turnEnd",
            "playerTurn":server.connected_client_sockets[gameManager.currentPlayer].id
        }
    );
    gameManager.nextTurn();
}

function endGame()
{
    server.send_data_to_all_clients(
        {
            "messageType":"gameControl",
            "eventType":"gameEnd"
        }
    );
}

class GameManager
{
    
    constructor(players, turnsPerPlayer)
    {
        this.initializeGame(players, turnsPerPlayer);
    }
    
    initializeGame(players, turnsPerPlayer)
    {
        this.numTurnsPerPlayer = turnsPerPlayer;
        this.numTurns = turnsPerPlayer * players;
        this.currentTurn = 0;
        this.numPlayers = players;
        this.currentPlayer = 0;
        this.onGameStart = () => {};
        this.onGameEnd = () => {};
        this.onTurnDrawingStart = () => {};
        this.onTurnDrawingEnd = () => {};
    }
    
    startGame()
    {
        this.currentTurn = 0;
        this.currentPlayer = 0;
        this.onGameStart();
        this.startTurnDrawing(this.currentPlayer);
    }
    
    nextTurn()
    {
        this.currentTurn++;
        
        if (this.currentTurn == this.numTurns)
        {
            this.endGame();
        }
        else
        {
            this.currentPlayer = (this.currentPlayer + 1) % this.numPlayers;
            this.startTurnDrawing(this.currentPlayer);
        }
    }
    
    endGame()
    {
        this.onGameEnd();
    }
    
    startTurnDrawing()
    {
        this.onTurnDrawingStart();
    }
    
    endTurnDrawing()
    {
        this.onTurnDrawingEnd();
    }
}

module.exports = {
    interpretGameControlCommand
};
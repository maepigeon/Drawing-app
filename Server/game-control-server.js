let server;
let gameManager;

function interpretGameControlCommand(message)
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
            gameManager.endTurn();
            break;
    }
}


function initializeGame(turnsPerPlayer)
{
    server = require("./index.js");
    gameManager = new GameManager(server.connected_client_sockets.length, turnsPerPlayer);
    gameManager.onGameStart = () => startGame();
    gameManager.onTurnStart = () => startTurn();
    gameManager.onTurnEnd = () => endTurn();
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
    server.send_data_to_all_clients(
        {
            "messageType":"gameState",
            "gameState":"gameStart",
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
    server.send_data_to_all_clients(
        {
            "messageType":"gameState",
            "gameState":"turnStart",
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
    server.send_data_to_all_clients(
        {
            "messageType":"gameState",
            "gameState":"turnEnd",
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
    server.send_data_to_all_clients(
        {
            "messageType":"gameState",
            "gameState":"gameEnd",
        }
    );
}

class GameManager
{
    // numTurnsPerPlayer = 0;
    // numTurns = 0;
    // currentTurn = -1;
    // numPlayers;
    // currentPlayer = -1;
    
    // onGameStart()
    // {
    // }
    // onGameEnd()
    // {
    // }
    // onTurnStart()
    // {
    // }
    // onTurnEnd()
    // {
    // }
    
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
        this.onTurnStart = () => {};
        this.onTurnEnd = () => {};
    }
    
    startGame()
    {
        this.currentTurn = 0;
        this.currentPlayer = 0;
        this.onGameStart();
        this.startTurn(this.currentPlayer);
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
            this.startTurn(this.currentPlayer);
        }
    }
    
    endGame()
    {
        this.onGameEnd();
    }
    
    startTurn()
    {
        this.onTurnStart();
    }
    
    endTurn()
    {
        this.onTurnEnd();
    }
}

module.exports = {
    interpretGameControlCommand
};
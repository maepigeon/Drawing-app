let server;
let gameManager;

let drawingRatings = [];
let playerScores = [];

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
        case "rateDrawing":
            submitDrawingRating(player, message.data.rating);
            break;
    }
}

function submitDrawingRating(player, rating)
{
    let entry = drawingRatings.find(e => e.player == player);
    if (entry == null)
    {
        drawingRatings.push(
            {
                "player":player, 
                "rating":rating
            }
        );
    }
    else
    {
        entry.rating = rating;
    }
    console.log("current drawing ratings:");
    drawingRatings.forEach(element => {
        console.log(element);
    });
}

function awardScoreForRatings()
{
    let amount = 0;
    drawingRatings.forEach(element => {
        amount += element.rating;
    });
    incrementScoreForPlayer(gameManager.currentPlayer, amount);
}

function incrementScoreForPlayer(player, amountToAward)
{
    let entry = playerScores.find(e => e.playerId == player);
    if (entry != null)
    {
        entry.score += amountToAward;
    }
    sendScoreUpdate();
}

function sendScoreUpdate()
{
    server.send_data_to_all_clients({
        "messageType":"gameControl",
        "eventType":"updateScores",
        "scores": playerScores
    });
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
    console.log("Game started");
    server.send_data_to_all_clients(
        {
            "messageType":"gameControl",
            "eventType":"gameStart",
        }
    );
    
    initializeScores()
}

function initializeScores()
{
    playerScores = [];
    server.connected_client_sockets.forEach(element => {
        playerScores.push(
            {
                "playerId": element.id,
                "score": 0
            }
        );
    });
    console.log("initialized player scores:");
    playerScores.forEach(element => {
        console.log(element);
    });
    sendScoreUpdate();
}

function initializeRatings()
{
    drawingRatings = [];
    server.connected_client_sockets.forEach(element => {
        let defaultScore = element.id == gameManager.currentPlayer ? 0 : 3;
        drawingRatings.push(
            {
                "player":element.id,
                "rating":defaultScore
            }
        );
    });
    console.log("initial drawing ratings:");
    drawingRatings.forEach(element => {
        console.log(element);
    });
}

function startTurn()
{
    console.log("current player is " + gameManager.currentPlayer);
    let player = server.connected_client_sockets[gameManager.currentPlayer];
    server.send_data_to_all_clients(
        {
            "messageType":"gameControl",
            "eventType":"turnStart",
            "player":
            {
                "id": player.id,
                "name": player.username
            }
        }
    );
    
    initializeRatings();
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
    let story = require("./story-control-server.js");
    story.addMostVotedAdditionToStory();
    awardScoreForRatings();
    gameManager.nextTurn();
}

function endGame()
{
    console.log("Game ended.");
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
export {GameManager};

class GameManager
{
    numTurnsPerPlayer;
    numTurns;
    currentTurn = -1;
    numPlayers;
    currentPlayer = -1;

    onGameStart;
    onGameEnd;
    onTurnStart;
    onTurnEnd;

    constructor(players, turnsPerPlayer)
    {
        this.initializeGame(players, turnsPerPlayer);
    }
    
    initializeGame(players, turnsPerPlayer)
    {
        this.numTurnsPerPlayer = turnsPerPlayer;
        this.numPlayers = players;
        this.numTurns = turnsPerPlayer * players;
    }

    startGame()
    {
        this.currentTurn = 1;
        this.currentPlayer = 1;
        this.onGameStart();
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

    startTurn(player)
    {
        this.onTurnStart();
    }

    endTurn()
    {
        this.onTurnEnd();
    }
}
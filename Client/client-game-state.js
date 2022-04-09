import {networking} from "./networking.js";
export {ClientGameState}

class ClientGameState
{
    static JoinGame = "joinGame";
    static BeforeGame = "beforeGame";
    static PlayerTurn = "playerTurn";
    static OtherPlayerTurn = "otherPlayerTurn";
    static GameOver = "gameOver";
    static RateDrawing = "rateDrawing";
    static RateStory = "rateStory";

    static currentGameState = ClientGameState.BeforeGame;
    static OnGameStateChanged = new CustomEvent("onGameStateChanged", {detail: this.currentGameState});

    static updateGameState(state)
    {
        ClientGameState.currentGameState = state;
        dispatchEvent(this.OnGameStateChanged);
        console.log("game state updated to " + state);
    }
}

export function interpretGameStateCommand(message)
{
    let gameState = message.gameState;
    console.log("interpreting game state: " + gameState);
    switch (gameState)
    {
        case "turnStart":
            if (message.playerTurn == networking.getUserId())
            {
                ClientGameState.updateGameState(ClientGameState.playerTurn);
            }
            else
            {
                ClientGameState.updateGameState(ClientGameState.OtherPlayerTurn);
            }
            break;
        case "gameEnd":
            ClientGameState.updateGameState(ClientGameState.GameOver);
            break;
    }
}
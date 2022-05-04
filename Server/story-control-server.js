const { onAllPlayersSubmittedStory, gameIsActive, numVotes, endStoryVotePhase } = require("./game-control-server.js");

let server;
let story = "";
let storySubmissions = [];

function initialize()
{
    server = require("./index.js");
}

function interpretStoryControlCommand(player, message)
{
    let eventType = message.data.event;
    console.log("interpreting story event: " + eventType);
    console.log(message);
    switch (eventType)
    {
        case "storyAddition":
            // addToStory(message.data.addition);
            submitStoryAddition(player, message.data.addition);
            break;
        case "storyReset":
            resetStory()
            break;
        case "storyVote":
            voteForStoryAddition(message.data.additionId);
            break;
        case "getStorySubmissions":
            sendStorySubmissions();
            break;
    }
}

function submitStoryAddition(player, addition)
{
    let entry = storySubmissions.find(e => e.player == player);
    if (entry == null)
    {
        storySubmissions.push(
            {
                "player":player, 
                "addition":addition, 
                "votes":0
            }
        );
    }
    else
    {
        entry.addition = addition;
    }
    console.log("new story submission: " + addition);
    console.log("current story additions:");
    storySubmissions.forEach(element => {
        console.log(element);
    });
    sendStorySubmissions();
    if (storySubmissions.length >= server.connected_client_sockets.length - 1)
    {
        onAllPlayersSubmittedStory();
    }
}

function getStorySubmissionCount()
{
    return storySubmissions.length;
}

let submittedVotes = 0;
function voteForStoryAddition(additionVotedOnId)
{
    storySubmissions[additionVotedOnId].votes++;
    submittedVotes++;
    console.log(storySubmissions[additionVotedOnId]);

    server.send_data_to_all_clients(
        {
            "messageType": "storyControl",
            "eventType": "votesForSubmissionUpdated",
            "submission": additionVotedOnId,
            "numVotes": storySubmissions[additionVotedOnId].votes
        }
    )

    if (submittedVotes >= (numVotes * server.getNumPlayers()))
    {
        endStoryVotePhase();
        submittedVotes = 0;
    }
}

function sendStorySubmissions()
{
    initialize();
    server.send_data_to_all_clients(
        {
            "messageType": "storyControl",
            "eventType": "getStorySubmissions",
            "submissions": storySubmissions
        }
    )
}

function addMostVotedAdditionToStory()
{
    if (storySubmissions.length == 0) return;
    let entry = storySubmissions[0];
    storySubmissions.forEach(submission => {
        if (submission.votes > entry.votes)
        {
            entry = submission;
        }
    });
    addToStory(entry.addition);
    resetStorySubmissions();
}

function resetStorySubmissions()
{
    storySubmissions = [];
    sendStorySubmissions();
}

function addToStory(addition)
{
    initialize();
    console.log("adding: " + addition);
    story += addition;
    sendStoryUpdate();
}

function resetStory()
{
    initialize();
    story = "";
    resetStorySubmissions();
    sendStoryUpdate();
}

function sendStoryUpdate()
{
    server.send_data_to_all_clients(
        {
            "messageType":"storyControl",
            "eventType":"storyUpdate",
            "story": story
        }
    );
}

module.exports = {
    interpretStoryControlCommand,
    addMostVotedAdditionToStory,
    storySubmissions,
    getStorySubmissionCount
};
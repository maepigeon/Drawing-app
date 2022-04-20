import {getWordList} from "./WordGenerator.js";
import {generateWord} from "./WordGenerator.js";
import {networking} from "./networking.js";
import { setDrawingEnabled } from "./canvas.js";
import { clearCanvas } from "./canvas.js";

let maxVotes = 3;
let votes = maxVotes;

// Updates the list of player names gui
export function updateNamesList(message) {
    let players = message.data.players;
    console.log(players);
    $("#players").empty();
    players.forEach(player => {   
        $("#players").append(
            "<p><span class='scorebox' id='player-" + player.id + "-scorebox'>0</span>" + player.username + "</p>"
            );

    });
}

export function interpretStoryControlCommand(message)
{
    let eventType = message.eventType;
    console.log("interpreting story event: " + eventType);
    switch (eventType)
    {
        case "storyUpdate":
            updateStory(message.story);
            break;
        case "getStorySubmissions":
            showStorySubmissions(message.submissions)
            break;
        case "":
            break;
    }
}

function showStorySubmissions(submissions)
{
    $("#story-submissions-container").text("");
    let idx = 0;
    submissions.forEach(submission => {
        
        $("#story-submissions-container").html(
            $("#story-submissions-container").html() + 
            '<div class = "submission-section" id = "submission-section'+ idx+'">' + submission.addition + '</div>' +
            '<div class = "vote-section" id = "vote-section'+idx+'"><span class="scorebox scorebox-small" style="margin: auto;">' + 
                submission.votes + '</span>' +
            '<button class="tool-button-small tool-button" style="margin: auto;" id="vote-for-addition-' + 
                idx + '-button"><i class="fa-solid fa-thumbs-up fa-lg"></i></button></div>' +
            "<br><br>"
        );
        var additionHeight = $("#submission-section"+ idx).height();
        $("#vote-section" + idx).height(additionHeight);
        
        idx++;
    });
    idx--;
    while (idx >= 0)
    {
        let id = idx
        document.getElementById('vote-for-addition-' + id + '-button').addEventListener("click", () => {
            voteForAddition(id);
        });
        idx--;
    }
}

function voteForAddition(additionId)
{
    if (votes > 0)
    {
        networking.sendMessage(
            "storyControl", 
            {
                "event": "storyVote", 
                "additionId": additionId
            }
        );
        votes--;
        $("#votes-remaining").text(votes);
    }
}

export function resetVotes()
{
    votes = maxVotes;
    $("#votes-remaining").text(votes);
}

function submitStoryAddition(addition)
{
    networking.sendMessage(
        "storyControl", 
        {
            "event": "storyAddition", 
            "addition": addition
        }
    );
}

function updateStory(story)
{
    console.log("updating story...");
    console.log("new story is: " + story);
    $("#story-box").text(story);
}

export function resetStory()
{
    networking.sendMessage(
        "storyControl", 
        {
            "event": "storyReset"
        }
    );
}

export function setStoryWritingEnabled(enabled)
{
    if (enabled)
    {
        $("#story-input-container").removeClass("hidden");
    }
    else
    {
        $("#story-input-container").addClass("hidden");
    }
}

$(function ()
{
    $("#votes-remaining").text(votes);

    $("#submit-story-button").on("click", () =>
    {
        console.log("submitting: " +  $("#story-input-area").val());
        submitStoryAddition($("#story-input-area").val());
    });

    $("#story-vote-button").on("click", () => {
        networking.sendMessage(
            "storyControl", 
            {
                "event": "storyVote"
            }
        );
    });
});
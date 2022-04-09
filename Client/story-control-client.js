import {getWordList} from "./WordGenerator.js";
import {generateWord} from "./WordGenerator.js";
import {networking} from "./networking.js";
import { setDrawingEnabled } from "./canvas.js";
import { clearCanvas } from "./canvas.js";


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
            "Player " + submission.player + "<br>" +
            '"' + submission.addition + '"' +
            "<br>" +
            "votes: " + submission.votes +
            '<button id="vote-for-addition-' + idx + '-button">Vote for this story addition (id: ' + idx + '</button>' +
            "<br><br>"
        );
        
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
    networking.sendMessage(
        "storyControl", 
        {
            "event": "storyVote", 
            "additionId": additionId
        }
    );
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
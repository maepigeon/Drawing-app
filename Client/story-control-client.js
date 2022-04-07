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
        case "":
            break;
        case "":
            break;
    }
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
});
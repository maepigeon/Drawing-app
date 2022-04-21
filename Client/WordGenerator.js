import { networking } from "./networking.js";

export {getWordList};
export {generateWord}

let words = [];


//This accesses a URL to generate a list of random words. todo: add other themes
async function getWordList(theme) {
    switch (theme) {
        case 1:
            const response = await fetch("./themed-words/natureandanimals.json");
            words = await response.json();
            break;
        case 2:
            const response2 = await fetch("./themed-words/foodanddrink.json");
            words = await response2.json();
            break;
        case 3:
            const response3 = await fetch("./themed-words/spooky.json");
            words = await response3.json();
            break;
        case 4:
            const response4 = await fetch("./themed-words/truerandom.json");
            words = await response4.json();
            break;
    }
    let rn = Math.floor(Math.random() * words.length);
    let word = words[rn];
    document.getElementById('prompt').innerHTML = word;
    
}

export function setThemeForAll(theme)
{
    networking.sendMessage(
        "gameControl",
        {
            "event": "setTheme",
            "theme": theme
        }
    );
}

//Generates a word
function generateWord() {
    if (words.length == 0) {
        document.getElementById('prompt').innerHTML = 'Please start game first';
    }
    else {
        let rn = Math.floor(Math.random() * words.length);
        let word = words[rn];
        document.getElementById('prompt').innerHTML = word;
    }
}

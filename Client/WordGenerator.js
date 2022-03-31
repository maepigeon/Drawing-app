let words = [];


//This accesses a URL to generate a list of random words. todo: add other themes
async function getWordList() {
    const requestURL = 'https://api.datamuse.com/words?topics=nature&max=250';
    const web = new Request(requestURL);
    const response = await fetch(web);
    words = await response.json();
    let rn = Math.floor(Math.random() * words.length);
    let word = words[rn].word;
    document.getElementById('prompt').innerHTML = word;
}

//Generates a word
function generateWord() {
    if (words.length == 0) {
        document.getElementById('prompt').innerHTML = 'Please start game first';
    }
    else {
        let rn = Math.floor(Math.random() * words.length);
        let word = words[rn].word;
        document.getElementById('prompt').innerHTML = word;
    }
}

$("#start-game-button").on("click", getWordList);
$("#end-turn-button").on("click", generateWord);
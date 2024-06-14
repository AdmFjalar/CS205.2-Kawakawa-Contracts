const INPUT_TEXT1_ID = 'Document01';
const INPUT_TEXT2_ID = 'Document02';
const PARAGRAPH1_ID = 'paragraph01';
const PARAGRAPH2_ID = 'paragraph02';
const HASH_FORM_ID = 'hashForm';

function toggleDisplay(testState) {
    var blankCenterBox = document.querySelector('.blankCenterBox');
    var matchCenterBox = document.querySelector('.matchCenterBox');
    var mismatchCenterBox = document.querySelector('.mismatchCenterBox');

    if (testState === "mismatch") {
        blankCenterBox.style.display = 'none';
        matchCenterBox.style.display = 'none';
        mismatchCenterBox.style.display = 'block';
    } else if (testState === "match") {
        blankCenterBox.style.display = 'none';
        matchCenterBox.style.display = 'block';
        mismatchCenterBox.style.display = 'none';
    } else {
        blankCenterBox.style.display = 'block';
        matchCenterBox.style.display = 'none';
        mismatchCenterBox.style.display = 'none';
    }
}

function calculateHash(text) {
    return sha3_512(text);
}

function compareTexts(text1, text2) {
    return calculateHash(text1) === calculateHash(text2);
}

function formHandler() {
    document.getElementById(HASH_FORM_ID).addEventListener('submit', function(event) {
        event.preventDefault();

        const inputText1 = document.getElementById(INPUT_TEXT1_ID).value;
        const inputText2 = document.getElementById(INPUT_TEXT2_ID).value;

        const result = compareTexts(inputText1, inputText2);
        
        document.getElementById(PARAGRAPH1_ID).innerText = inputText1;
        document.getElementById(PARAGRAPH2_ID).innerText = inputText2;

        document.getElementById(INPUT_TEXT1_ID).style.display = 'none';
        document.getElementById(INPUT_TEXT2_ID).style.display = 'none';

        document.getElementById(PARAGRAPH1_ID).style.display = 'block';
        document.getElementById(PARAGRAPH2_ID).style.display = 'block';

        if (result) {
            toggleDisplay("match");
        } else {
            toggleDisplay("mismatch");
        }
    });
}

function hideInitialElements() {
    document.querySelector('.matchCenterBox').style.display = 'none';
    document.querySelector('.mismatchCenterBox').style.display = 'none';
}

window.onload = function() {
    hideInitialElements();
    formHandler();
};

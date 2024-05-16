const INPUT_TEXT1_ID = 'inputText1';
const INPUT_TEXT2_ID = 'inputText2';
const HASH_FORM_ID = 'hashForm';
const HASH_RESULT_ID = 'hashResult';

function calculateHash(text) {
    return sha3_512(text);
}

function compareTexts(text1, text2) {
    if (calculateHash(text1) === calculateHash(text2)) {
        return "Texts match";
    }
    return "Texts do not match";
}

function formHandler() {
    document.getElementById(HASH_FORM_ID).addEventListener('submit', function(event) {
        event.preventDefault();

        const inputText1 = document.getElementById(INPUT_TEXT1_ID).value;
        const inputText2 = document.getElementById(INPUT_TEXT2_ID).value;

        document.getElementById(HASH_RESULT_ID).innerText = compareTexts(inputText1, inputText2);
    });
}

formHandler();

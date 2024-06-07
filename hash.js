const INPUT_TEXT1_ID = 'inputText1';
const INPUT_TEXT2_ID = 'inputText2';
const IGNORE_INDICES_ID = 'ignoreIndices';
const HASH_FORM_ID = 'hashForm';
const HASH_RESULT_ID = 'hashResult';

function ignoreText(text, ignoreIndicesInput) {
    const ignoreIndices = ignoreIndicesInput.split(',').map(Number).filter(index => !isNaN(index));
    return text.split('').filter((char, index) => !ignoreIndices.includes(index)).join('');
}

function calculateHash(text) {
    return sha3_512(text);
}

function compareTexts(text1, text2) {
   const match = calculateHash(filteredText1) === calculateHash(filteredText2);

    return {
        match
    };
}

function formHandler() {
    document.getElementById(HASH_FORM_ID).addEventListener('submit', function(event) {
        event.preventDefault();

        const inputText1 = document.getElementById(INPUT_TEXT1_ID).value;
        const inputText2 = document.getElementById(INPUT_TEXT2_ID).value;
       
        const result = compareTexts(inputText1, inputText2);
        let resultText = result.match ? "Texts match" : `Texts do not match at indices`;

        document.getElementById(HASH_RESULT_ID).innerText = resultText;
    });
}

formHandler();

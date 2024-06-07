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

function compareTexts(text1, text2, ignoreIndicesInput) {
    let nonMatchingIndices = [];
    const ignoreIndices = ignoreIndicesInput.split(',').map(Number).filter(index => !isNaN(index));

    for (let i = 0; i < Math.max(text1.length, text2.length); i++) {
        if (!ignoreIndices.includes(i) && text1[i] !== text2[i]) {
            nonMatchingIndices.push(i);
        }
    }

    const filteredText1 = ignoreText(text1, ignoreIndicesInput);
    const filteredText2 = ignoreText(text2, ignoreIndicesInput);
    const match = calculateHash(filteredText1) === calculateHash(filteredText2);

    return {
        match,
        nonMatchingIndices
    };
}

function formHandler() {
    document.getElementById(HASH_FORM_ID).addEventListener('submit', function(event) {
        event.preventDefault();

        const inputText1 = document.getElementById(INPUT_TEXT1_ID).value;
        const inputText2 = document.getElementById(INPUT_TEXT2_ID).value;
        const ignoreIndicesInput = document.getElementById(IGNORE_INDICES_ID).value;

        const result = compareTexts(inputText1, inputText2, ignoreIndicesInput);
        let resultText = result.match ? "Texts match" : `Texts do not match at indices: ${result.nonMatchingIndices.join(', ')}`;

        document.getElementById(HASH_RESULT_ID).innerText = resultText;
    });
}

formHandler();


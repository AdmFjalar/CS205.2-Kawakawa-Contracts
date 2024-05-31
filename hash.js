const INPUT_TEXT1_ID = 'Document01';
const INPUT_TEXT2_ID = 'Document02';
const IGNORE_INDICES_ID = 'ignoreIndices';
const HASH_FORM_ID = 'hashForm';
const HASH_RESULT_ID = 'hashResult';

function findShortestDiff(text1, text2) {
    diff(text1, text2);
}

function calculateHash(text) {
    return sha3_512(text);
}

function ignoreText(unalteredText, ignoreIndices) {
    return unalteredText.split('').filter((char, index) => !ignoreIndices.includes(index)).join('');
}

function compareTexts(text1, text2/*, ignoreIndices*/) {
    let nonMatchingIndices = [];
    
    /*for (let i = 0; i < Math.max(text1.length, text2.length); i++) {
       
        if (!ignoreIndices.includes(i) && text1[i] !== text2[i]) {
            nonMatchingIndices.push(i);
        }
    }*/

       // const filteredText1 = ignoreText(text1, ignoreIndices);
       // const filteredText2 = ignoreText(text2, ignoreIndices);
    
       
        const match = calculateHash(text1/*filteredText1*/) === calculateHash(text2/*filteredText2*/);
        
        return match;//{
            //match,
            //nonMatchingIndices
        //};

}

function formHandler() {
    document.getElementById(HASH_FORM_ID).addEventListener('submit', function(event) {
        event.preventDefault();

        const inputText1 = document.getElementById(INPUT_TEXT1_ID).value;
        const inputText2 = document.getElementById(INPUT_TEXT2_ID).value;
        //const ignoreIndicesInput = document.getElementById(IGNORE_INDICES_ID).value;
        //const ignoreIndices = ignoreIndicesInput.split(',').map(Number).filter(index => !isNaN(index));

        const result = compareTexts(inputText1, inputText2/*, ignoreIndices*/);
        let resultText = result.match ? "Texts match" : "Texts do not match";/*`Texts do not match at indices: ${result.nonMatchingIndices.join(', ')}`*/
        
        document.getElementById(HASH_RESULT_ID).innerText = resultText;
        
    });

}

formHandler();


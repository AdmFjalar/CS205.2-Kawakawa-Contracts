function CalculateHash(text) {
    return sha3_512(text);
}

function CompareTexts(text1, text2) {
    if (calculateHash(text1) === calculateHash(text2)) {
        return "Texts match";
    }
    return "Texts do not match";
}

function FormHandler() {
    document.getElementById('hashForm').addEventListener('submit', function(event) {
        event.preventDefault();

        var inputText1 = document.getElementById('inputText1').value;
        var inputText2 = document.getElementById('inputText2').value;

        document.getElementById('hashResult').innerText = compareTexts(inputText1, inputText2);
    });
}

FormHandler();
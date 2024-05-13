<script src="https://cdnjs.cloudflare.com/ajax/libs/js-sha3/0.8.0/sha3.min.js"></script>

document.getElementById('hashForm').addEventListener('submit', function(event) {
    event.preventDefault();

    var inputText = document.getElementById('inputText').value;
    var hash = sha3_512(inputText);

    document.getElementById('hashResult').innerText = "SHA3-512 hash of '" + inputText + "': " + hash;
});

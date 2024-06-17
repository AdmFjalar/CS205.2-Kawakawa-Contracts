const INPUT_TEXT1_ID = 'Document01';
const INPUT_TEXT2_ID = 'Document02';
const PARAGRAPH1_ID = 'paragraph01';
const PARAGRAPH2_ID = 'paragraph02';
const HASH_FORM_ID = 'hashForm';

var BACKGROUND_COLORS = [
  "rgb(36,113,164)",
  "rgb(13,206,164)",
  "rgb(127,29,218)"
];

let lastColors = [];

function getRandomColors() {
  var randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * BACKGROUND_COLORS.length);
  } while (lastColors.includes(randomIndex));
  lastColors.push(randomIndex);
  if (lastColors.length > BACKGROUND_COLORS.length) {
    lastColors.shift();
  }
  return BACKGROUND_COLORS[randomIndex];
}

function darkenColor(rgb, percent) {
  const [r, g, b] = rgb.match(/\d+/g).map(Number);

  const factor = 1 - percent / 100;
  const newR = Math.max(0, Math.min(255, Math.floor(r * factor)));
  const newG = Math.max(0, Math.min(255, Math.floor(g * factor)));
  const newB = Math.max(0, Math.min(255, Math.floor(b * factor)));
  return `rgb(${newR},${newG},${newB})`;
}

function createGradient(rgb) {
  const darkerColor = darkenColor(rgb, 50);
  return `linear-gradient(${rgb}, ${darkerColor})`;
}

function generateIgnoreBox() {
  //get orginal element
  var original = document.getElementById('ignoreBox01');
  //clone element and it's content
  var clone = original.cloneNode(true);
  //set new attributes like ID and color
  clone.id = 'ignoreBox02';
  //get a new color
  var newColor = getRandomColors(); //returns a single colour from the list
  var newGradient = createGradient(newColor);//turns this into a gradient

  clone.style.background = newGradient;

  //append
  var targetDiv = document.getElementById('mismatchCenterBox01');
  targetDiv.appendChild(clone);
}

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

/**
 * Performs a word-level diff between two texts and logs the indexes of added and removed words.
 * @param {string} text1 The first text.
 * @param {string} text2 The second text.
 * @returns {Object} An object containing arrays of removed and added word indexes.
 */
function diff(text1, text2) {
  const removed = [];
  const added = [];

  // Tokenize the texts into arrays of words
  const words1 = text1.split(' ');
  const words2 = text2.split(' ');

  // Find removed words
  removed.push(...words1.filter(word => !words2.includes(word)));

  // Find added words
  added.push(...words2.filter(word => !words1.includes(word)));

  return { removed, added };
}

function wrapIndexesWithColors(textContainer1Id, textContainer2Id, diffOutput) {
  const textContainer1 = document.getElementById(textContainer1Id);
  const textContainer2 = document.getElementById(textContainer2Id);
  const text1 = textContainer1.textContent.trim(); // Trim to remove any leading/trailing whitespace
  const text2 = textContainer2.textContent.trim(); // Trim to remove any leading/trailing whitespace

  const removed = diffOutput.removed;
  const added = diffOutput.added;

  // Log removed and added words to console for troubleshooting
  console.log('Removed Words:', removed);
  console.log('Added Words:', added);

  // Function to wrap words with colored spans
  const wrapWords = (container, words, originalText) => {
    let result = '';
    let currentIndex = 0;

    words.forEach(word => {
      // Find the index of the word in the original text
      const startIndex = originalText.indexOf(word, currentIndex);
      const endIndex = startIndex + word.length;

      // Append unchanged text before the word
      result += originalText.substring(currentIndex, startIndex);

      // Wrap the word in a span with a random background color
      result += `<span style="background-color: #${Math.floor(Math.random() * 16777215).toString(16)}">${word}</span>`;

      // Move the current index past this word
      currentIndex = endIndex;
    });

    // Append any remaining unchanged text after the last word
    result += originalText.substring(currentIndex);

    // Update the container with the wrapped words
    container.innerHTML = result;
  };

  // Wrap removed and added words in respective containers
  wrapWords(textContainer1, removed, text1);
  wrapWords(textContainer2, added, text2);
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

    document.getElementById(PARAGRAPH1_ID).textContent = inputText1;
    document.getElementById(PARAGRAPH2_ID).textContent = inputText2;

    // Perform word-level diff
    const diffOutput = diff(inputText1, inputText2);

    // Highlight the changes in the paragraphs
    wrapIndexesWithColors(PARAGRAPH1_ID, PARAGRAPH2_ID, diffOutput);
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
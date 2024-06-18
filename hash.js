const INPUT_TEXT1_ID = 'Document01';
const INPUT_TEXT2_ID = 'Document02';
const PARAGRAPH1_ID = 'paragraph01';
const PARAGRAPH2_ID = 'paragraph02';
const HASH_FORM_ID = 'hashForm';
const HASH_RESULT_ID = 'hashResult';

var COLOR_INDEX; // Index to use for both color arrays
var lastColors = []; // Array to store recently used indices, acting as a fixed-size queue
var SOLID_COLORS = [
    "rgb(36,113,164)",
    "rgb(13,206,164)",
    "rgb(127,29,218)",
    "rgb(210,235,52)",
    "rgb(137,229,245)"
];

var GRAD_COLORS = [
    "linear-gradient(rgb(36,113,164), rgb(18,56,82))",
    "linear-gradient(rgb(13,206,164), rgb(6,103,82))",
    "linear-gradient(rgb(127,29,218), rgb(63,15,109))",
    "linear-gradient(rgb(210,235,52), rgb(105,117,26))",
    "linear-gradient(rgb(137,229,245), rgb(68,115,122))"
];

function getNewColorIndex() {
    var randomIndex;
    
    // If lastColors array is full, remove the oldest entry
    if (lastColors.length === Math.ceil(SOLID_COLORS.length / 2)) {
        lastColors.shift(); 
    }
    
    // Generate a random index that hasn't been used recently
    do {
        randomIndex = Math.floor(Math.random() * SOLID_COLORS.length);
    } while (lastColors.includes(randomIndex));
    
    lastColors.push(randomIndex); // Add the new randomIndex to lastColors
    
    COLOR_INDEX = randomIndex; // Update COLOR_INDEX with the current randomIndex
    return COLOR_INDEX;
}

function generateIgnoreBox(ID) {
  //get orginal element
  var original = document.getElementById('ignoreBoxTemplate');
  //clone element and it's content
  var clone = original.cloneNode(true);
  //set new attributes like ID and color
  clone.id = 'ignoreBox${ID}';

  //getNewColorIndex();//Remove this when text colors are working
  clone.style.background = GRAD_COLORS[COLOR_INDEX];
  //set display from hidden to block
  clone.style.display=block;
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
function diffTexts(text1, text2) {
  // Step 1: Compute the longest common subsequence (LCS) using dynamic programming

  // Initialize a 2D array to store the length of LCS for substrings
  const dp = [];
  const len1 = text1.length;
  const len2 = text2.length;

  for (let i = 0; i <= len1; i++) {
      dp[i] = [];
      for (let j = 0; j <= len2; j++) {
          if (i === 0 || j === 0) {
              dp[i][j] = 0;
          } else if (text1[i - 1] === text2[j - 1]) {
              dp[i][j] = dp[i - 1][j - 1] + 1;
          } else {
              dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
          }
      }
  }

  // Step 2: Trace back to find the differences
  let i = len1;
  let j = len2;
  const diff = {
      removed: [],
      added: []
  };

  while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && text1[i - 1] === text2[j - 1]) {
          // Characters are the same, move diagonally up-left
          i--;
          j--;
      } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
          // Character in text2 is added
          diff.added.unshift(j - 1); // Store index of added character
          j--;
      } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
          // Character in text1 is removed
          diff.removed.unshift(i - 1); // Store index of removed character
          i--;
      }
  }

  console.log(diff);

  return diff;
}

// Function to wrap characters in text with specified highlights
function wrapIndexesWithColors(textContainer1Id, textContainer2Id, diffOutput) {
  const textContainer1 = document.getElementById(textContainer1Id);
  const textContainer2 = document.getElementById(textContainer2Id);
  const text1 = textContainer1?.textContent?.trim() || '';
  const text2 = textContainer2?.textContent?.trim() || '';

  // Function to wrap characters with colored spans
  const wrapCharacters = (text, changes) => {
    if (!text || !changes || changes.length === 0) {
      return text; // Return original text if there are no changes
    }

    let result = '';
    let currentIndex = 0;

    while (currentIndex < text.length) {
      if (changes.includes(currentIndex)) {
        const start = currentIndex;
        // Find end of the sequence of changes
        while (currentIndex < text.length && changes.includes(currentIndex)) {
          currentIndex++;
        }
        const end = currentIndex;
        // Wrap sequence of changes in span tag
        result += `<span style="background-color: yellow;">${text.substring(start, end)}</span>`;
      } else {
        result += text[currentIndex];
        currentIndex++;
      }
    }

    return result;
  };

// Wrap removed characters in text1
const wrappedText1 = wrapCharacters(text1, diffOutput.removed);
textContainer1.innerHTML = wrappedText1;

// Wrap added characters in text2
const wrappedText2 = wrapCharacters(text2, diffOutput.added);
textContainer2.innerHTML = wrappedText2;
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
    const diffOutput = diffTexts(inputText1, inputText2);

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
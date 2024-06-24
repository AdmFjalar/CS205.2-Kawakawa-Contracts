// Element IDs
const inputText1Id = 'document01';
const inputText2Id = 'document02';
const paragraph1Id = 'paragraph01';
const paragraph2Id = 'paragraph02';
const hashFormId = 'hashForm';
const mismatchTextId = 'mismatchText';
const originIgnoreBoxId = 'ignoreBox01';
const blankCenterBoxId = 'blankCenterBox';
const matchCenterBoxId = 'matchCenterBox';
const mismatchCenterBoxId = 'mismatchCenterBox';

// Global variables
const ignoreGray = 'rgb(217, 215, 210)';
const matchGreen = 'linear-gradient(rgb(32, 239, 32), rgb(24, 179, 24))';
const mismatchRed = 'linear-gradient(rgb(243, 9, 9), rgb(174, 10, 10))';
const idColorMap = {};

let colorIndex; // Index to use for both color arrays
let lastColors = []; // Array to store recently used indices, acting as a fixed-size queue
const solidColors = [
    "rgb(36,113,164)",
    "rgb(13,206,164)",
    "rgb(127,29,218)",
    "rgb(210,235,52)",
    "rgb(137,229,245)"
];

const gradColors = [
    "linear-gradient(rgb(36,113,164), rgb(18,56,82))",
    "linear-gradient(rgb(13,206,164), rgb(6,103,82))",
    "linear-gradient(rgb(127,29,218), rgb(63,15,109))",
    "linear-gradient(rgb(210,235,52), rgb(105,117,26))",
    "linear-gradient(rgb(137,229,245), rgb(68,115,122))"
];


/**
 * Retrieves a new random color index that has not been used recently.
 *
 * @return {number} The new random color index.
 */
function getNewColorIndex() {
    let randomIndex;
    
    // Check if the lastColors array is full and remove the oldest entry
    if (lastColors.length === Math.ceil(solidColors.length / 2)) {
        lastColors.shift(); 
    }
    
    // Generate a random index that hasn't been used recently
    do {
        randomIndex = Math.floor(Math.random() * solidColors.length);
    } while (lastColors.includes(randomIndex));
    
    // Add the new randomIndex to lastColors
    lastColors.push(randomIndex);
    
    // Update colorIndex with the current randomIndex
    colorIndex = randomIndex;
    
    return colorIndex;
}



/**
 * Generates a new ignore box element with the given ID and text content.
 *
 * @param {string} id - The ID of the ignore box.
 * @param {string} text - The text content of the ignore box.
 */
function generateIgnoreBox(id, text) {
  // Get the original ignore box element
  const originBox = document.getElementById(originIgnoreBoxId);

  // Clone the original ignore box element
  const clonedBox = originBox.cloneNode(true);

  // Set the display of the cloned box to 'block'
  clonedBox.style.display = 'block';

  // Set the ID of the cloned box
  clonedBox.id = `ignorebox-${id}`;

  // Set the text content of the first <p> element in the cloned box
  clonedBox.querySelector('p').textContent = text;

  // Get a new color for the ignore box
  const newColor = gradColors[colorIndex];

  // Store the new color in the ID color map
  idColorMap[id] = newColor;

  // Set the background color of the cloned box to the new color
  clonedBox.style.background = newColor;

  // Get the checkbox and toggle label elements in the cloned box
  const checkbox = clonedBox.querySelector('.toggle');
  const toggleLabel = clonedBox.querySelector('.toggleLabel');

  // Generate a unique ID for the checkbox
  const checkboxId = `ignore${id}`;

  // Set the ID of the checkbox
  checkbox.id = checkboxId;

  // Set the 'for' attribute of the toggle label to the checkbox ID
  toggleLabel.setAttribute('for', checkboxId);

  // Get the target div element to append the cloned box to
  const targetDiv = document.getElementsByClassName(mismatchCenterBoxId)[0];

  // Append the cloned box to the target div
  targetDiv.appendChild(clonedBox);
}



/**
 * Toggles the display of center boxes based on the test state.
 *
 * @param {string} state - The match/mismatch state. Can be "mismatch", "match", or "blank".
 */
function toggleDisplay(state) {
  // Get the center boxes by their IDs
  const centerBoxes = {
    blank: document.getElementById(blankCenterBoxId),
    match: document.getElementById(matchCenterBoxId),
    mismatch: document.getElementById(mismatchCenterBoxId)
  };

  // Toggle the display of the center boxes based on the test state
  switch (state) {
    // If the test state is "mismatch", hide the blank and match center boxes and show the mismatch center box
    case "mismatch":
      centerBoxes.blank.style.display = 'none';
      centerBoxes.match.style.display = 'none';
      centerBoxes.mismatch.style.display = 'block';
      break;

    // If the test state is "match", hide the blank center box and show the match and mismatch center boxes
    case "match":
      centerBoxes.blank.style.display = 'none';
      centerBoxes.match.style.display = 'block';
      centerBoxes.mismatch.style.display = 'none';
      break;

    // If the test state is neither "mismatch" nor "match", show the blank center box and hide the match and mismatch center boxes
    default:
      centerBoxes.blank.style.display = 'block';
      centerBoxes.match.style.display = 'none';
      centerBoxes.mismatch.style.display = 'none';
  }
}
   


/**
 * Calculates the SHA3-512 hash value of a given text.
 *
 * @param {string} text - The text to calculate the hash for.
 * @return {string} The SHA3-512 hash value of the text.
 */
function calculateHash(text) {
  // Calculate the SHA3-512 hash of the given text.
  return sha3_512(text);
}



/**
 * Compares two texts by calculating their SHA3-512 hash values and checking if they are equal.
 * @param {string} text1 - The first text.
 * @param {string} text2 - The second text.
 * @return {boolean} True if the hash values of the texts are equal, false otherwise.
 */
function compareTexts(text1, text2) {
  // Calculate the SHA3-512 hash values of the texts
  // and check if they are equal.
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
  return diff;
}



/**
 * Wraps characters in the specified text containers with colored spans based on the given diff output.
 * @param {string} textContainer1Id - The ID of the first text container.
 * @param {string} textContainer2Id - The ID of the second text container.
 * @param {object} diffOutput - The diff output containing the removed and added characters.
 */
function wrapIndexesWithColors(textContainer1Id, textContainer2Id, diffOutput) {
  // Get the text containers and their texts
  const textContainer1 = document.getElementById(textContainer1Id);
  const textContainer2 = document.getElementById(textContainer2Id);
  const text1 = textContainer1?.textContent?.trim() || '';
  const text2 = textContainer2?.textContent?.trim() || '';

  /**
   * Wraps characters with colored spans in the given text based on the specified changes.
   * @param {string} text - The text to wrap characters in.
   * @param {number[]} changes - The indices of characters to wrap.
   * @returns {string} - The wrapped text.
   */
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

        // Generate a random ID for the highlight span
        const id = Math.random().toString(36).substring(7);

        // Wrap sequence of changes in span tag
        result += `<span id="highlight-${id}" style="background-color: ${solidColors[getNewColorIndex()]};">${text.substring(start, end)}</span>`;
        generateIgnoreBox(id, text.substring(start, end));

        storeHighlight(id, start, end);
      } else {
        result += text[currentIndex];
        currentIndex++;
      }
    }

    return result;
  };

  // Wrap removed characters in text1
  document.getElementById(mismatchCenterBoxId).innerHTML += '<h3>REMOVED</h3>';
  const wrappedText1 = wrapCharacters(text1, diffOutput.removed);
  textContainer1.innerHTML = wrappedText1;

  // Wrap added characters in text2
  document.getElementById(mismatchCenterBoxId).innerHTML += '<h3>ADDED</h3>';
  const wrappedText2 = wrapCharacters(text2, diffOutput.added);
  textContainer2.innerHTML = wrappedText2;
}



/**
 * Stores the highlight information for a given ID.
 * @param {string} id - The ID of the highlight.
 * @param {number} start - The starting index of the highlight.
 * @param {number} end - The ending index of the highlight.
 * @returns {Object} - An object containing the highlight information.
 */
const storeHighlight = (id, start, end) => {
  // Create an object to store the highlight information
  const highlights = {};

  // Store the highlight information with the given ID, start, and end indices
  highlights[id] = { start, end };

  // Return the object containing the highlight information
  return highlights;
}



/**
 * Updates the mismatch box on the page.
 * @param {boolean} mismatchesIgnored - Indicates whether mismatches are ignored.
 */
function updateMismatchBox(mismatchesIgnored) {
  // Get the mismatch center box element
  const mismatchBox = document.getElementById(mismatchCenterBoxId);

  // Get the mismatch text element
  const mismatchText = document.getElementById(mismatchTextId);

  // Set the background color of the mismatch box based on whether mismatches are ignored
  mismatchBox.style.background = mismatchesIgnored ? matchGreen : mismatchRed;

  // Set the inner HTML of the mismatch text element based on whether mismatches are ignored
  mismatchText.innerHTML = mismatchesIgnored ? "MATCH" : "MISMATCH";
}



/**
 * Adds event listener to the form submission event.
 * It prevents the default form submission behavior and performs the necessary actions.
 */
function formHandler() {
  document.getElementById(hashFormId).addEventListener('submit', function(event) {
    event.preventDefault();

    // Update the mismatch box
    updateMismatchBox(false);

    // Hide the initial elements
    hideInitialElements();

    // Get the container element
    const container = document.getElementById(mismatchCenterBoxId);

    // Remove all child elements except the first one
    const children = Array.from(container.children);
    if (children.length > 3) {
      children.slice(3).forEach(child => container.removeChild(child));
    }

    // Get the input texts
    const inputText1 = document.getElementById(inputText1Id).value;
    const inputText2 = document.getElementById(inputText2Id).value;

    // Compare the texts
    const result = compareTexts(inputText1, inputText2);

    // Update the paragraphs with the input texts
    document.getElementById(paragraph1Id).innerText = inputText1;
    document.getElementById(paragraph2Id).innerText = inputText2;

    // Hide the input texts and paragraphs
    document.getElementById(inputText1Id).style.display = 'none';
    document.getElementById(inputText2Id).style.display = 'none';
    document.getElementById(paragraph1Id).style.display = 'block';
    document.getElementById(paragraph2Id).style.display = 'block';

    // Toggle the display based on the result
    if (result) {
        toggleDisplay("match");
    } else {
        toggleDisplay("mismatch");
    }

    // Update the paragraphs with the input texts
    document.getElementById(paragraph1Id).textContent = inputText1;
    document.getElementById(paragraph2Id).textContent = inputText2;

    // Perform word-level diff
    const diffOutput = diffTexts(inputText1, inputText2);

    // Highlight the changes in the paragraphs
    wrapIndexesWithColors(paragraph1Id, paragraph2Id, diffOutput);

    // Get all ignore boxes except the first one
    const ignoreBoxes = document.querySelectorAll('.ignoreBox:not(#ignoreBox01)');

    // Add event listener to each ignore box toggle
    ignoreBoxes.forEach(ignoreBox => {
      const toggle = ignoreBox.querySelector('.toggle');
    
      toggle.addEventListener('click', () => {
        const sharedID = ignoreBox.id.replace('ignorebox-', '');
        const highlightId = `highlight-${sharedID}`;
        const highlight = document.getElementById(highlightId);

        // Toggle the background color of the highlight and ignore box
        if (!toggle.checked) {
          // Ignore box is turned on
          highlight.style.background = idColorMap[sharedID];
          ignoreBox.style.background = idColorMap[sharedID];
        } else {
          // Ignore box is turned off
          highlight.style.background = ignoreGray;
          ignoreBox.style.background = ignoreGray;
        }

        // Check if all toggles are on
        const allTogglesOn = Array.from(ignoreBoxes).every(ignoreBox => ignoreBox.querySelector('.toggle').checked);

        updateMismatchBox(allTogglesOn);
    
      });
    });    
  });
}



/**
 * Hides the initial elements on the page.
 * This function is called on the window load event.
 */
function hideInitialElements() {
  // Hide the 'matchCenterBox' element
  // This element is initially displayed by default
  document.getElementById(matchCenterBoxId).style.display = 'none';

  // Hide the 'mismatchCenterBox' element
  // This element is initially displayed by default
  document.getElementById(mismatchCenterBoxId).style.display = 'none';
}



/**
 * This function is called when the window has finished loading.
 * It hides the initial elements on the page and sets up the form handler.
 */
window.onload = function() {
  // Hide the initial elements on the page
  hideInitialElements();

  // Set up the form handler
  formHandler();
};

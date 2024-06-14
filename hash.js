const INPUT_TEXT1_ID = 'Document01';
const INPUT_TEXT2_ID = 'Document02';
const IGNORE_INDICES_ID = 'ignoreIndices';
const HASH_FORM_ID = 'hashForm';
const HASH_RESULT_ID = 'hashResult';

var BACKGROUND_COLORS =[
"rgb(36,113,164)",
"rgb(13,206,164)",
"rgb(127,29,218)"];

let lastColors=[];

function getRandomColors(){ //fetches an RGB code from the array; dosen't re-use any colors till entire array is used
    var randomIndex;
    do{
        randomIndex =Math.floor(Math.random()*BACKGROUND_COLORS.length);
    }
    while (lastColors.includes(randomIndex));
    lastColors.push(randomIndex);
    if (lastColors.length>BACKGROUND_COLORS.length){
        lastColors.shift();
    }
    return BACKGROUND_COLORS[randomIndex];
}

function darkenColor(rgb,percent){ //darkens RGB by specified percentage and returns new rgb code
    const[r,g,b]=rgb.match(/\d+/g).map(Number);

    const factor=1-percent/100;
    const newR=Math.max(0,Math.min(255,Math.floor(r*factor)));
    const newG=Math.max(0,Math.min(255,Math.floor(g*factor)));
    const newB=Math.max(0,Math.min(255,Math.floor(b*factor)));
    return "rgb(${newR},${newG},${newB})";
}

function createGradient(rgb){ //takes an RGB, generates a darker version and creates a gradient 
    const darkerColor=darkenColor(rgb, 50);
    return "linear-gradient(${rbg}, ${darkerColor})";
}

function generateIgnoreBox(){ 

    //get orginal element
    var original=document.getElementById('ignoreBox01');
    //clone element and it's content
    var clone=original.cloneNode(true);
    //set new attributes like ID and color
    clone.id ='ignoreBox02';
    //get a new color
    var newColor=getRandomColors(); //returns a single colour from the list
    var newGradient=createGradient(newColor);//turns this into a gradient
    

    clone.style.background=newGradient;


    //append
    var targetDiv=document.getElementById('mismatchCenterBox01');
    targetDiv.appendChild(clone);


}


function toggleDisplay(testState){ //toggles visibility of centre div section
    var blankCenterBox = document.querySelector('.blankCenterBox');
    var matchCenterBox = document.querySelector('.matchCenterBox');
    var mismatchCenterBox = document.querySelector('.mismatchCenterBox');
    
    if (testState === "mismatch"){
        blankCenterBox.style.display='none';
        matchCenterBox.style.display='none';
        mismatchCenterBox.style.display='block'; 
    }
    else if(testState=== "match" ){
        blankCenterBox.style.display='none';
        matchCenterBox.style.display='block';
        mismatchCenterBox.style.display='none'; 
    }
    else
    {
        blankCenterBox.style.display='block';
        matchCenterBox.style.display='none';
        mismatchCenterBox.style.display='none'; 
    }
    }

function calculateHash(text) {
    return sha3_512(text);
}

function ignoreText(text, ignoreIndicesInput) {
    const ignoreIndices = ignoreIndicesInput.split(',').map(Number).filter(index => !isNaN(index));
    return text.split('').filter((char, index) => !ignoreIndices.includes(index)).join('');
}

function compareTexts(text1, text2) {    
        const match = calculateHash(text1) === calculateHash(text2);
        
        return match;
}

function diff(text1, text2) {
    const removed = [];
    const added = [];
  
    let i = 0;
    let j = 0;
  
    while (i < text1.length && j < text2.length) {
      if (text1[i] === text2[j]) {
        i++;
        j++;
      } else {
        removed.push(i);
        j++;
        while (j < text2.length && text1[i] !== text2[j]) {
          added.push(j);
          j++;
        }
        i++;
      }
    }
  
    while (j < text2.length) {
      added.push(j);
      j++;
    }
  
    return { removed, added };
  }

  function wrapIndexesWithColors(textContainer1Id, textContainer2Id, diffOutput) {
    const textContainer1 = document.getElementById(textContainer1Id);
    const textContainer2 = document.getElementById(textContainer2Id);
    const text1 = textContainer1.textContent;
    const text2 = textContainer2.textContent;
  
    const removed = [];
    const added = [];
  
    let start = -1;
    let end = -1;
  
    for (let i = 0; i < diffOutput.length; i++) {
      const [type, text] = diffOutput[i];
      if (type === 0) {
        for (let j = 0; j < text.length; j++) {
          removed.push(text1[j]);
          added.push(text2[j]);
        }
      } else if (type === -1) {
        for (let j = 0; j < text.length; j++) {
          removed.push(text1[start + j]);
        }
      } else if (type === 1) {
        for (let j = 0; j < text.length; j++) {
          added.push(text2[start + j]);
        }
      }
      start += text.length;
    }
  
    textContainer1.innerHTML = removed.map((char, index) => {
      const id = `highlight-${Math.random().toString(36).substring(2, 15)}`;
      const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
      return `<span id="${id}" style="background-color: ${color}">${char}</span>`;
    }).join('');
  
    textContainer2.innerHTML = added.map((char, index) => {
      const id = `highlight-${Math.random().toString(36).substring(2, 15)}`;
      const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
      return `<span id="${id}" style="background-color: ${color}">${char}</span>`;
    }).join('');
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
        
        if (result){
            toggleDisplay("match");
        }
        
        else{
            toggleDisplay("mismatch");
            generateIgnoreBox();
            
        }
        

        
        //const result = compareTexts(inputText1, inputText2);
        //var diffOutput = diff(inputText1, inputText2);
        //wrapIndexesWithColors(INPUT_TEXT1_ID, INPUT_TEXT2_ID, diffOutput);
    });

}
formHandler();

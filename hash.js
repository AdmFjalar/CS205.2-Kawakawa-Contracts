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
        
        if (result){
            toggleDisplay("match");
        }
        
        else{
            toggleDisplay("mismatch");
            generateIgnoreBox();
            
        }
        

        //document.getElementById(HASH_RESULT_ID).innerText = resultText;
        
    });

}




formHandler();




const INPUT_TEXT1_ID = 'Document01';
const INPUT_TEXT2_ID = 'Document02';
const IGNORE_INDICES_ID = 'ignoreIndices';
const HASH_FORM_ID = 'hashForm';
const HASH_RESULT_ID = 'hashResult';

var BACKGROUND_COLORS =[
"linear-gradient(rgb(36, 113, 164),rgb(18, 56, 82))",
"linear-gradient(rgb(171, 22, 92),rgb(85,11,46))",
"linear-gradient(rgb(13, 206, 164),rgb(6,103,82))",
"linear-gradient(rgb(146, 113, 75),rgb(73, 56, 57))",
"linear-gradient(rgb(127, 29, 218),rgb(63,14,109))",
"linear-gradient(rgb(169, 205, 27),rgb(84,103,13))"];

let lastColors=[];

function getRandomColors(){
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

function generateIgnoreBox(){ 

    //get orginal element
    var original=document.getElementById('ignoreBox01');
    //clone element and it's content
    var clone=original.cloneNode(true);
    //set new attributes like ID and color
    clone.id ='ignoreBox02';
    //get a new color
    var newColor=getRandomColors();
    clone.style.background=newColor;


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




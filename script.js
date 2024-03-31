async function convertToAudio() {
     const input = document.getElementById('pdf-file');
     const file = input.files[0];
 
     if (!file) {
         alert('الرجاء اختيار ملف PDF للتحويل.');
         return;
     }
 
     if (file.type !== 'application/pdf') {
         alert('الرجاء اختيار ملف PDF فقط.');
         return;
     }
 
     const text = await extractTextFromPDF(file);
     if (!text) {
         alert('حدث خطأ أثناء استخراج النص من ملف PDF.');
         return;
     }
 }
 
 function extractTextFromPDF(file) {
     return new Promise((resolve, reject) => {
         const reader = new FileReader();
         reader.onload = function(event) {
             const typedArray = new Uint8Array(event.target.result);
             pdfjsLib.getDocument(typedArray).promise.then(function(pdf) {
                 var text = '';
                 const pageCount = pdf.numPages;
                 const getPageText = (pageNumber) => {
                     return pdf.getPage(pageNumber).then(function(page) {
                         return page.getTextContent().then(function(content) {
                             const pageText = content.items.map(function(item) {
                                 return item.str;
                             }).join(' ');
                             text += pageText;
                             if (pageNumber < pageCount) {
                                 return getPageText(pageNumber + 1);
                             } else {
                                 document.querySelector('.text').innerHTML = text
                                 return text;
                             }
                         });
                     });
                 };
                 return getPageText(1);
             }).then(resolve).catch(reject);
         };
         reader.readAsArrayBuffer(file);
     });
 }
 
function view(){
    let text = document.querySelector('.text').innerHTML;
    console.log(text) 
}
 


// =========================================================================


// creates a new instance of the SpeechSynthesisUtterance object
let speech=new SpeechSynthesisUtterance();

// array will be used to store the available voices on the user's device.
let voices= [];

let voiceSelect = document.querySelector("select");

window.speechSynthesis.onvoiceschanged=()=>{
     voices = window.speechSynthesis.getVoices();
    //  sets the voice of the SpeechSynthesisUtterance object to the first voice in the voices array. This is the default voice.
     speech.voice=voices[0];

     voices.forEach((voice,i)=>(voiceSelect.options[i] = new Option(voice.name,i)));
};

voiceSelect.addEventListener("change",()=>{
    speech.voice = voices[voiceSelect.value];
})


document.querySelector(".listen").addEventListener("click",() => {
     speech.text=document.querySelector("textarea").value;
     window.speechSynthesis.speak(speech);
});
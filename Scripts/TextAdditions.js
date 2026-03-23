let target, template = null, clearButton, additions = [];

init();

function init(){
    target = document.getElementById("commandLineBody");
    clearButton = document.getElementById("clear-button");
    clearButton.addEventListener("click", clear);

    fetch("Additions.html")
    .then((response) => response.text())
    .then((html) => {saveTemplate(html)}) 
    .catch((error) => {console.warn(error);})
}

function addText(id){
    if (template === null) {return;}
    console.log(template);
    const newText = template.getElementById(id).cloneNode(true);
    target.insertBefore(newText, clearButton)
    additions.push(newText);
}

function saveTemplate(html){
    const parser = new DOMParser();
    template = parser.parseFromString(html, "text/html");
}

function clear(){
    console.log("wuh");
    additions.forEach((element) => element.remove());
}


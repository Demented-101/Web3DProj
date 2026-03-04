let target, template = null;

init();

function init(){
    target = document.getElementById("commandLineBody");

    fetch("Additions.html")
    .then((response) => response.text())
    .then((html) => {saveTemplate(html)}) 
    .catch((error) => {console.warn(error);})
}

function addText(id){
    if (template === null) {return;}
    console.log(template);
    const welcomeText = template.getElementById(id).cloneNode(true);
    target.appendChild(welcomeText);
}

function saveTemplate(html){
    const parser = new DOMParser();
    template = parser.parseFromString(html, "text/html");
    console.log(template);
}


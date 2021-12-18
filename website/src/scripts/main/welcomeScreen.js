let welcomeScreen = document.getElementById("welcomeScreen");
let welcomeScreenChild = welcomeScreen.children[0];
let topHead = document.getElementById("topHead");
let bodyDiv = document.getElementById("bodyDiv");

//welcomeScreenChild.style.height = (topHead.clientHeight-8).toString() + "px";

function animate(){
    window.setTimeout(()=>{
        welcomeScreen.style.height = topHead.clientHeight.toString() + "px";
        welcomeScreenChild.style.width = welcomeScreenChild.children[0].clientWidth.toString() + "px";
        window.setTimeout(()=>{
            welcomeScreen.style.display = "none";
            alert("Use the first button on the purple toolbar to show the selection toolbar. Then select a tool to select area on the map.")
        }, 2050)
    }, 2000);
}

window.addEventListener("load", animate);
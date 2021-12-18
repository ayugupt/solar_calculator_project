import positionButtons from "./scrollToNextPage"

function giveGenerateOption(){
    document.getElementById("generateReportButton").style.display = "flex"
    positionButtons()
}

function takeGenerateOption(){
    document.getElementById("generateReportButton").style.display = "none"
}

function giveViewOption(){
    document.getElementById("nextPageButton").style.display = "block"
    positionButtons()
}

function takeViewOption(){
    document.getElementById("nextPageButton").style.display = "none"
}

let reportFuncs = {giveGenerateOption, takeGenerateOption, giveViewOption, takeViewOption}

export default reportFuncs;
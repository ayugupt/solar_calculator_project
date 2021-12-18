import TempScrollBox from './getScrollBarWidth';
let scrollBar = new TempScrollBox();

function hideYScrollBar(element){
    element.style.width = (window.innerWidth+scrollBar.width).toString() + "px";
    window.addEventListener('resize', ()=>{
        element.style.width = (window.innerWidth+scrollBar.width).toString() + "px";
    })
}

export default hideYScrollBar;
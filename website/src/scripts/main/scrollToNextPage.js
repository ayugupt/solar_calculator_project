import React from 'react'
import ReactDOM from 'react-dom'
import Button from '../button.js'

let padding = 12;
let button = document.getElementById("nextPageButton");
let reportButton = document.getElementById("generateReportButton")
let body = document.getElementById("bodyDiv");

let buttonComponentInstance = ReactDOM.render(<Button style={{main: {transform: "rotate(0deg)", transition: "transform 0.5s linear"}}} action={scrollPage} iconSrc="/images/down.svg" hold={false}/>, button);
let i = 1;
let intervalTimeout = 3;
let scrolled = false

function scrollPage(){
    if(i < 100){
        i = 1;
        scrolled = true
        buttonComponentInstance.mainRef.current.style.transform = "rotate(180deg)";
        let timer = window.setInterval(()=>{
            if(i > 100){
                window.clearInterval(timer);
            }
            let func = Math.sin((i/100)*Math.PI/2);
            body.scroll(0, window.innerHeight*func);
            button.style.top = (window.innerHeight + button.clientHeight*(func-1)-padding).toString() + "px";
            i++;
        }, intervalTimeout)
    }else{
        i = 100;
        buttonComponentInstance.mainRef.current.style.transform = "rotate(0deg)";
        scrolled = false
        let timer = window.setInterval(()=>{
            if(i < 0){
                window.clearInterval(timer);
            }
            let func = Math.sin((i/100)*Math.PI/2);
            body.scroll(0, window.innerHeight*func);
            button.style.top = (window.innerHeight + button.clientHeight*(func-1)-padding).toString() + "px";
            i--;
        }, intervalTimeout);
    }
    
}


function positionButtons(){
    if(!scrolled){
        button.style.top = (window.innerHeight-button.clientHeight-padding).toString()+"px";
    }else{
        button.style.top = (window.innerHeight-padding).toString()+"px";
    }
    button.style.left = (window.innerWidth/2 - button.clientWidth/2).toString() + "px";
    reportButton.style.left = (window.innerWidth/2 - reportButton.clientWidth/2).toString() + "px";
    reportButton.style.top = (window.innerHeight-reportButton.clientHeight-padding).toString()+"px"
}

positionButtons()
//reportButton.style.display = "none"
window.addEventListener("resize", positionButtons)

export default positionButtons;




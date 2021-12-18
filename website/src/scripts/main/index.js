import './welcomeScreen.js';

import ReactDOM from 'react-dom'
import React from 'react'

import Map from './map.js'
import '../../style/main/style.css';
import asyncHTTPRequest from '../asyncHTTPRequest.js'
import Tile from '../tile.js';
import AreaCanvas from './areaCanvas.js';
import hideYScrollBar from '../hideYScrollBar.js';

import reportFuncs from './generateReportOption.js';

import handleUserScrollFuncs from '../handleUserScroll.js'
import generateReport from './generateReport.js';

hideYScrollBar(document.getElementById("bodyDiv"));
handleUserScrollFuncs.preventScroll(document.getElementById("bodyDiv"))


let electricityRate = 10// Rs/kwh
let areaRequiredPerKW = 10// m2/kWp
let consumptionOfPowerPerSquareMeter = 50 // kWh/m2
let averageAnnualConsumptionOfPower = 0 // kwh
let area = 0// m2
let pricePerKW = 60000// Rs
let angle = 13.7041// degrees
let annualPowerGenerationFromSolar = 0;// kWh
let co2ProducedPerKWH = 0.95;// kg/kWh

let vrArea = {value:""}
let vrUsage = {value:""}
let vrRate = {value:""}
let vrPrice = {value:""}


const a = ReactDOM.render(<Map/>, document.getElementById("mapHolder"))
a.setOnSelectExtraFunc = ()=>{
    reportFuncs.takeGenerateOption()
    let locs = a.returnSelectLocationPoints();

    let roofArea = Math.floor(calcArea(locs))
    area = roofArea/Math.cos(angle*Math.PI/180)

    averageAnnualConsumptionOfPower = roofArea*consumptionOfPowerPerSquareMeter

    vrArea.value = roofArea.toString();
    vrUsage.value = vrUsage.value.length==0||!vrUsage.value?averageAnnualConsumptionOfPower.toString():vrUsage.value
    vrRate.value = vrRate.value.length==0||!vrRate.value?electricityRate.toString():vrRate.value
    vrPrice.value = vrPrice.value.length==0||!vrPrice.value?pricePerKW.toString():vrPrice.value

    ReactDOM.render(<AreaCanvas coordinates={a.returnAreaPoints()}/>, document.getElementById("areaCanvasHolder"));
    asyncHTTPRequest('GET', `https://atlas.microsoft.com/search/address/reverse/json?subscription-key=oSyNpTEwFAk4JqlLJp8zXQIrEhjVaR4z03cfkYpmtec&api-version=1.0&query=${locs[0][1]},${locs[0][0]}`).then((result)=>{
        let addressObject = result.addresses[0].address
        let addressString = `${addressObject.municipality}, ${addressObject.countrySubdivision}, ${addressObject.postalCode}, ${addressObject.country}`
        ReactDOM.render(<Tile heading="Region" icon="/images/region.svg" bodylhs={addressString} bodyrhs="" iconColor="blue" editable={false} />, document.getElementById("regionTile"))
        ReactDOM.render(<Tile heading="" icon="/images/select.svg" bodylhs="Total Area(m2)" bodyrhs={vrArea.value} upperDivider={true} iconColor="black" editable={true} variable={vrArea}/>, document.getElementById("areaTile"))
        ReactDOM.render(<Tile heading="" icon="/images/electricity.svg" bodylhs="Annual Electricity Usage(kWh)" bodyrhs={vrUsage.value} iconColor="red" editable={true} variable={vrUsage}/>, document.getElementById("usageTile"))
        ReactDOM.render(<Tile heading="" icon="/images/electricity.svg" bodylhs="Average cost of electricity(Rs/kWh)" bodyrhs={vrRate.value} iconColor="green" editable={true} variable={vrRate}/>, document.getElementById("rateTile"))
        ReactDOM.render(<Tile heading="" icon="/images/price.svg" bodylhs="Solar System Cost(Rs/kWp)" bodyrhs={vrPrice.value} iconColor="yellow" editable={true} variable={vrPrice}/>, document.getElementById("priceTile"))

        reportFuncs.giveGenerateOption()

    }).catch((error)=>{
        console.log(error)
    })
}
ReactDOM.render(<Tile heading="Region" icon="/images/region.svg" bodylhs="Select Area" bodyrhs="" iconColor="blue" editable={false} />, document.getElementById("regionTile"))
ReactDOM.render(<Tile heading="" icon="/images/select.svg" bodylhs="Total Area(m2)" bodyrhs="Select Area" upperDivider={true} iconColor="black" editable={false} variable={vrArea}/>, document.getElementById("areaTile"))
ReactDOM.render(<Tile heading="" icon="/images/electricity.svg" bodylhs="Annual Electricity Usage(kWh)" bodyrhs="Select Area" iconColor="red" editable={false} variable={vrUsage}/>, document.getElementById("usageTile"))
ReactDOM.render(<Tile heading="" icon="/images/electricity.svg" bodylhs="Avg cost of electricity(Rs/kWh)" bodyrhs="Select Area" iconColor="green" editable={false} variable={vrRate}/>, document.getElementById("rateTile"))
ReactDOM.render(<Tile heading="" icon="/images/price.svg" bodylhs="Solar System Cost(Rs/kWp)" bodyrhs="Select Area" iconColor="yellow" editable={false} variable={vrPrice}/>, document.getElementById("priceTile"))

document.getElementById("generateReportButton").addEventListener("click", ()=>{
    generateReport(parseFloat((vrArea.value)/Math.cos(angle*Math.PI/180)), angle, areaRequiredPerKW, parseFloat(vrUsage.value), parseFloat(vrRate.value), parseFloat(vrPrice.value), co2ProducedPerKWH)

    reportFuncs.takeGenerateOption()
    reportFuncs.giveViewOption()
    //generateReport(parseFloat((vrArea.value)/Math.cos(angle*Math.PI/180)), angle, areaRequiredPerKW, parseFloat(vrUsage.value), parseFloat(vrRate.value), parseFloat(vrPrice.value))
})

function convertLatLongToCartesian(locations){
    return locations.map((location)=>{
        let cartesianCoord = {};
        cartesianCoord.y = Math.abs(location[1]*Math.PI*6371000/180);
        cartesianCoord.x = Math.abs(6371000*Math.PI*location[0]*Math.cos(location[1]*Math.PI/180)/180);
        return cartesianCoord;
    })
}

function calcArea(locations){
    let points = convertLatLongToCartesian(locations);
    let sum = 0;
    let len = points.length;
    for(let i = 0; i < len-1; i++){
        sum  = sum + ((points[i].x*points[i+1].y) - (points[i].y*points[i+1].x));
    }
    return Math.abs(sum/2);
}
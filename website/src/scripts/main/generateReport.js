import ReactDOM from 'react-dom'
import React from 'react'

import data from '../../data/cleaned_year_data.csv'
import asyncHTTPRequest from '../asyncHTTPRequest';

import PieChart from '../graphs/piechart.js';
import Plot from '../graphs/plot.js';
import Counter from '../graphs/counter.js'
import BarChart from '../graphs/barchart.js'
import react from 'react';

let joulesPerKWH = 1000*60*60
let radiansPerDegree = Math.PI/180

const seasonEnum = {0: 'winter', 1:'spring', 2:'spring', 3:'summer', 4:'summer', 5:'summer', 6:'monsoon', 7:'monsoon', 8:'monsoon', 9:'autumn', 10:'autumn', 11:'winter'}

// ReactDOM.render(<PieChart fields={[{name:"ayush", part:20, color:"red"}, {name:"dhawal", part: 20, color:"blue"}, {name:"vanita", part: 60, color:"yellow"}]} id="devices"/>, document.getElementById("tempPie"));
// ReactDOM.render(<Plot data={{first:{values:[100, 251, 759, 99, 141, 641, 333], color:"green"}, second:{values:[450, 22, 657, 500, 234, 91, 333], color:"red"}}} labels={["a", "b", "aysuh", "22-12-2021", 'vc', '34', '10']} holderID="tempPlot"/>, document.getElementById("tempPlot"))
// ReactDOM.render(<Counter number={5004050321} color="black" title="Days till something"/>, document.getElementById("tempCounter"))


//let dataString = '{"0": "12.630221", "1": "12.904466", "2": "12.860017", "3": "12.805456", "4": "12.75643", "5": "12.716594", "6": "12.678314", "7": "12.640884", "8": "12.630221", "9": "12.630221", "10": "12.630221", "11": "12.630221", "12": "12.630221", "13": "12.630221", "14": "12.630221", "15": "12.630221", "16": "12.630221", "17": "12.630221", "18": "12.630221", "19": "12.630221", "20": "12.630221", "21": "12.630221", "22": "12.630221", "23": "12.630221", "24": "12.630221", "25": "12.630221", "26": "12.630221", "27": "12.630221", "28": "12.630221", "29": "12.630221", "30": "12.630221", "31": "12.630221", "32": "12.630221", "33": "12.630221", "34": "12.630221", "35": "12.630221", "36": "12.630221", "37": "12.630221", "38": "12.630221", "39": "12.630221", "40": "12.630221", "41": "12.630221", "42": "12.650475", "43": "12.722641", "44": "12.818389", "45": "12.93064", "46": "13.057656", "47": "13.194925", "48": "13.339596", "49": "13.4899025", "50": "13.644353", "51": "13.801851", "52": "13.961614", "53": "14.12305", "54": "14.285723", "55": "14.44931", "56": "14.613576", "57": "14.778342", "58": "14.943478", "59": "15.108887", "60": "15.293699", "61": "15.495524", "62": "15.709013", "63": "15.93408", "64": "16.169256", "65": "16.413069", "66": "16.664543", "67": "16.922722", "68": "17.186756", "69": "17.455929", "70": "17.729599", "71": "18.007208", "72": "18.288267", "73": "18.57235", "74": "18.859074", "75": "19.148119", "76": "19.439192", "77": "19.732042", "78": "20.026451", "79": "20.322222", "80": "20.619186", "81": "20.917196", "82": "21.216122", "83": "21.452652", "84": "21.627115", "85": "21.79412", "86": "21.953579", "87": "22.103874", "88": "22.245462", "89": "22.378815", "90": "22.50431", "91": "22.622309", "92": "22.733154", "93": "22.837172", "94": "22.934677", "95": "23.02597", "96": "23.111336", "97": "23.191044", "98": "23.265358", "99": "23.334526", "100": "23.39878", "101": "23.458351", "102": "23.51345", "103": "23.564285", "104": "23.61105", "105": "23.653933", "106": "23.693111", "107": "23.728756", "108": "23.761028", "109": "23.790085", "110": "23.816072", "111": "23.839132", "112": "23.859398", "113": "23.876999", "114": "23.892057", "115": "23.90469", "116": "23.915009", "117": "23.923119", "118": "23.929121", "119": "23.933113", "120": "23.935188", "121": "23.935436", "122": "23.933937", "123": "23.93077", "124": "23.926018", "125": "23.919748", "126": "23.912031", "127": "23.902935", "128": "23.892523", "129": "23.880854", "130": "23.867987", "131": "23.853977", "132": "23.838875", "133": "23.822733", "134": "23.8056", "135": "23.787518", "136": "23.768532", "137": "23.748684", "138": "23.728014", "139": "23.706558", "140": "23.684355", "141": "23.661438", "142": "23.63784", "143": "23.61359", "144": "23.58872", "145": "23.56326", "146": "23.537233", "147": "23.510668", "148": "23.48359", "149": "23.45602", "150": "23.427982", "151": "23.399498", "152": "23.370588", "153": "23.341272", "154": "23.31157", "155": "23.281494", "156": "23.251068", "157": "23.220306", "158": "23.18922", "159": "23.15783", "160": "23.126144", "161": "23.094183", "162": "23.061954", "163": "23.029472", "164": "22.996748", "165": "22.96379", "166": "22.930614", "167": "22.897228", "168": "22.863642", "169": "22.829865", "170": "22.795904", "171": "22.761768", "172": "22.727467", "173": "22.693007", "174": "22.658394", "175": "22.623638", "176": "22.588745", "177": "22.553719", "178": "22.518566", "179": "22.483295", "180": "22.44791", "181": "22.412418", "182": "22.376822", "183": "22.341125", "184": "22.305334", "185": "22.269453", "186": "22.233486", "187": "22.197437", "188": "22.16131", "189": "22.125107", "190": "22.088833", "191": "22.05249", "192": "22.016083", "193": "21.979614", "194": "21.943087", "195": "21.906502", "196": "21.869864", "197": "21.833174", "198": "21.796436", "199": "21.759651", "200": "21.72282", "201": "21.685947", "202": "21.649033", "203": "21.61208", "204": "21.575092", "205": "21.538069", "206": "21.50101", "207": "21.463923", "208": "21.426804", "209": "21.389654", "210": "21.352478", "211": "21.315273", "212": "21.278044", "213": "21.240791", "214": "21.203516", "215": "21.166218", "216": "21.128899", "217": "21.09156", "218": "21.054203", "219": "21.016827", "220": "20.979431", "221": "20.94202", "222": "20.904594", "223": "20.867153", "224": "20.829697", "225": "20.792227", "226": "20.754744", "227": "20.717247", "228": "20.679739", "229": "20.64222", "230": "20.60469", "231": "20.56715", "232": "20.5296", "233": "20.49204", "234": "20.454472", "235": "20.416893", "236": "20.379307", "237": "20.341713", "238": "20.304111", "239": "20.266504", "240": "20.22889", "241": "20.191269", "242": "20.15364", "243": "20.116009", "244": "20.07837", "245": "20.040726", "246": "20.003077", "247": "19.965424", "248": "19.927765", "249": "19.890102", "250": "19.852436", "251": "19.814764", "252": "19.777088", "253": "19.739408", "254": "19.701725", "255": "19.66404", "256": "19.62635", "257": "19.588657", "258": "19.550962", "259": "19.513264", "260": "19.475563", "261": "19.43786", "262": "19.400154", "263": "19.362446", "264": "19.324736", "265": "19.287024", "266": "19.24931", "267": "19.211594", "268": "19.173876", "269": "19.136156", "270": "19.098434", "271": "19.06071", "272": "19.022987", "273": "18.985262", "274": "18.947535", "275": "18.909807", "276": "18.872078", "277": "18.834347", "278": "18.796616", "279": "18.758883", "280": "18.72115", "281": "18.685919", "282": "18.660757", "283": "18.644411", "284": "18.634626", "285": "18.629547", "286": "18.627808", "287": "18.628433", "288": "18.630732", "289": "18.634214", "290": "18.638535", "291": "18.643448", "292": "18.64878", "293": "18.65441", "294": "18.660248", "295": "18.666235", "296": "18.672327", "297": "18.678493", "298": "18.684713", "299": "18.690971", "300": "18.697254", "301": "18.703556", "302": "18.709871", "303": "18.699814", "304": "18.658758", "305": "18.587862", "306": "18.489464", "307": "18.36624", "308": "18.220688", "309": "18.055077", "310": "17.871452", "311": "17.67165", "312": "17.457321", "313": "17.229946", "314": "17.012804", "315": "16.846914", "316": "16.699154", "317": "16.570524", "318": "16.453117", "319": "16.344383", "320": "16.241476", "321": "16.142765", "322": "16.046968", "323": "15.953236", "324": "15.86095", "325": "15.769684", "326": "15.679133", "327": "15.589087", "328": "15.499395", "329": "15.409952", "330": "15.320685", "331": "15.231541", "332": "15.142484", "333": "15.053488", "334": "14.964535", "335": "14.875611", "336": "14.78671", "337": "14.697823", "338": "14.608946", "339": "14.520076", "340": "14.431212", "341": "14.342352", "342": "14.253493", "343": "14.1646385", "344": "14.075783", "345": "13.98693", "346": "13.898076", "347": "13.809223", "348": "13.720371", "349": "13.631519", "350": "13.542667", "351": "13.47334", "352": "13.42995", "353": "13.390462", "354": "13.353211", "355": "13.3157215", "356": "13.278313", "357": "13.240817", "358": "13.203331", "359": "13.165835", "360": "13.128342", "361": "13.090846", "362": "13.053353", "363": "13.015859", "364": "12.978365"}'

async function generateReport(area, angle, areaRequiredPerKW, averageAnnualConsumptionOfPower, electricityRate, pricePerKW, co2ProducedPerKWH){

    showLoadScreen()

    let dayNo = getDayNumberOfYear()
    let ghip, ghip2, ghip3;
    for(let row of data){
        if(row['Day'] == dayNo){
            ghip = row['GHIP']/1000000
            ghip2 = row['GHIP2']/1000000
            ghip3 = row['GHIP3']/1000000
        }
    }

    let response = await asyncHTTPRequest("POST", "/getPredictionData", JSON.stringify({data:[dayNo, ghip, ghip2, ghip3]}), [{name:"Content-Type", value:"application/json"}])
    //let response = JSON.parse(dataString)

    let annualSolarIrradiance = 0
    let solarIrradianceData = []

    for(let i = 0; i <= 364; i++){
        solarIrradianceData.push(parseFloat(response[i.toString()])*1000000/joulesPerKWH)
        annualSolarIrradiance += parseFloat(response[i.toString()])*1000000
    }

    let dailySolarPowerGeneration = solarIrradianceData.map((data)=>{
        let d = area*(100/areaRequiredPerKW)*data*Math.cos(angle*radiansPerDegree)*0.9*0.8
        return d;
    })

    annualSolarIrradiance = annualSolarIrradiance/joulesPerKWH
    let solarPowerGeneration = area*(100/areaRequiredPerKW)*annualSolarIrradiance*Math.cos(angle*radiansPerDegree)*0.9*0.8

    let excessElectricityRequired = averageAnnualConsumptionOfPower-solarPowerGeneration
    if(excessElectricityRequired < 0){
        excessElectricityRequired = 0
    }

    let moneySavedEachYear = electricityRate*(averageAnnualConsumptionOfPower-excessElectricityRequired)
    let moneySpentOnSolarPanels = pricePerKW*area/areaRequiredPerKW

    let buyBackPeriodInMonths = Math.round(12*moneySpentOnSolarPanels/moneySavedEachYear)

    let co2MitigatedInTonnes = Math.round(co2ProducedPerKWH*(averageAnnualConsumptionOfPower-excessElectricityRequired)*25/1000)

    let year = getYear()

    let labelsMoneySpent = []
    let solarMoneySpentData = []
    let noSolarMoneySpentData = []

    let solarTotalCost = 0
    let noSolarTotalCost = 0
    for(let i = 1; i <= 25; i++){
        labelsMoneySpent.push((year+i).toString())
        if(i == 1){
            solarTotalCost += parseFloat((moneySpentOnSolarPanels+excessElectricityRequired*electricityRate).toFixed(2))
        }else{
            solarTotalCost += parseFloat((excessElectricityRequired*electricityRate).toFixed(2))
        }
        noSolarTotalCost += parseFloat((averageAnnualConsumptionOfPower*electricityRate).toFixed(2))

        solarMoneySpentData.push(solarTotalCost)
        noSolarMoneySpentData.push(noSolarTotalCost)
    }

    let month = getMonth()
    let day = getDay()
    console.log(month, day)

    let seasonRadiation = {monsoon:0, summer:0, winter:0, spring:0, autumn:0}
    let totalSum = 0

    let dayStrings = []

    for(let i = 1; i <= 365; i++){
        let date = new Date(year, month, day+i)
        let mth = date.getMonth()
        seasonRadiation[seasonEnum[mth]] += dailySolarPowerGeneration[i-1]
        totalSum += dailySolarPowerGeneration[i-1]
        dayStrings.push(date.toLocaleDateString())
    }

    let seasonRadiationArr = []

    seasonRadiationArr.push({name:"monsoon", part:Math.round((seasonRadiation['monsoon']/totalSum)*100), color:'blue'})
    seasonRadiationArr.push({name:"summer", part:Math.round((seasonRadiation['summer']/totalSum)*100), color:'yellow'})
    seasonRadiationArr.push({name:"spring", part:Math.round((seasonRadiation['spring']/totalSum)*100), color:'green'})
    seasonRadiationArr.push({name:"winter", part:Math.round((seasonRadiation['winter']/totalSum)*100), color:'lightblue'})
    let autumnPart = 100 -Math.round((seasonRadiation['monsoon']/totalSum)*100)-Math.round((seasonRadiation['summer']/totalSum)*100)-Math.round((seasonRadiation['spring']/totalSum)*100)-Math.round((seasonRadiation['winter']/totalSum)*100)
    seasonRadiationArr.push({name:"autumn", part:autumnPart, color:'orange'})

    let dailySolarData = dailySolarPowerGeneration.map((sol)=>{
        return parseFloat(sol.toFixed(2))
    })

    let co2MitigatedPerTree = 3
    let trees = Math.round(co2MitigatedInTonnes/co2MitigatedPerTree)

    let newBill = parseFloat((excessElectricityRequired*electricityRate).toFixed(2))
    let oldBill = parseFloat((averageAnnualConsumptionOfPower*electricityRate).toFixed(2))


    ReactDOM.render(<BarChart data={{OldCost: {value: oldBill, color:"pink"}, NewCost:{value:newBill, color:"purple"}}} labels={["Old Cost", "New Cost"]} holderID="electricityBillPlot" desc="Electricty Bill Comparision"/>, document.getElementById("electricityBillPlot"))
    ReactDOM.render(<PieChart fields={seasonRadiationArr} id="seasonPieChart" desc="Seasonal Solar Power Output"/>, document.getElementById("seasonalGenerationPie"))    
    ReactDOM.render(<Plot data={{Solar:{values:solarMoneySpentData, color:"green"}, NoSolar:{values:noSolarMoneySpentData, color:"red"}}} labels={labelsMoneySpent} holderID="moneySpentPlot" desc="Money Spent over the years in Rs."/>, document.getElementById("moneySpentPlot"))
    ReactDOM.render(<Plot data={{SolarPower:{values:dailySolarData, color:"blue"}}} labels={dayStrings} desc="Solar Power Generated for the next Year in kWh" holderID="solarGeneratedPlot"/>, document.getElementById("solarGeneratedPlot"))
    // console.log(annualSolarIrradiance, "solar irradince got")
    // console.log(solarPowerGeneration, "solar power generated")
    // console.log(excessElectricityRequired, "exces electricity")
    // console.log(moneySavedEachYear, "money saved each year")
    // console.log(moneySpentOnSolarPanels, "money spent on solar panels")
    // console.log(buyBackPeriodInMonths, "buybackperiod")

    ReactDOM.render(<Counter number={buyBackPeriodInMonths} color="black" title="Months" heading="PayBack Period"/>, document.getElementById("buyBackCounter"))
    ReactDOM.render(<Counter number={co2MitigatedInTonnes} color="black" title="Tonnes" heading="CO2 Mitigated over lifetime"/>, document.getElementById("co2Mitigated"))
    ReactDOM.render(<Counter number={trees} color="black" title="Trees" heading="Equivalent to Planting"/>, document.getElementById("treesCounter"))
    hideLoadScreen()
}

function getDayNumberOfYear(){
    let dateNow = new Date()
    let start = new Date(dateNow.getFullYear(), 0, 0)
    let millisecondsInOneDay = 24*60*60*1000

    let dayNo = Math.floor((dateNow-start)/millisecondsInOneDay)%366

    return dayNo; 
}

function getYear(){
    let date = new Date()
    return date.getFullYear()
}

function getMonth(){
    return new Date().getMonth()
}

function getDay(){
    return new Date().getDate()
}

function showLoadScreen(){
    document.getElementById("loadingScreen").style.display = "flex"
}

function hideLoadScreen(){
    document.getElementById("loadingScreen").style.display = "none"
}

export default generateReport;
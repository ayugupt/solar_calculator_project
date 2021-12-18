import React from 'react'
import "../../style/charts/barchart.css"
import asyncTimer from '../asyncTimer';

class BarChart extends React.Component{
    constructor(props){
        super(props);
        this.props = props;

        this.viewBox = {height: 200, width:200}
        this.padding = {left: 25, right: 22, top: 5, bottom: 20} 

        this.origin = {x:this.padding.left, y:this.padding.top}
        this.height = this.viewBox.height-this.padding.top-this.padding.bottom
        this.width = this.viewBox.width-this.padding.left-this.padding.right
        this.legendSquareSide = 3

        let plotObjects = []

        for(let key in this.props.data){
            plotObjects.push({color: this.props.data[key].color, x: '0', y: '0', height:'0', key: key})
        }

        this.state = {plotObjects: plotObjects, animated: false, hoverCardDetails:{style:{display:"none"},  value:""}, yLabels: [], xLabels:[], legend: []}
    }

    componentDidMount(){
        this.drawAxes(this.props)
        this.triggerAnimationOnScrollIntoView()
    }

    shouldComponentUpdate(nextProps, nextState){
        if(nextState == this.state && this.props != nextProps){
            let plotObjects = []

            for(let key in nextProps.data){
                plotObjects.push({color: nextProps.data[key].color, x: '0', y: '0', height: '0', key: key})
            }
            let animated = false
            if(document.getElementById(nextProps.holderID).getBoundingClientRect().top < window.innerHeight){
                animated = true
            }

            this.setState({animated:animated, plotObjects: plotObjects,})
            this.drawAxes(nextProps)
            
            if(document.getElementById(nextProps.holderID).getBoundingClientRect().top < window.innerHeight){
                window.setTimeout(()=>{
                    this.animatePlots()
                }, 1000)
            }
        }
        return true;
    }

    
    drawAxes(props){
        this.calculateMaxY(props);
        this.calculateYInterval();
        let d = `M ${this.origin.x},${this.origin.y} L ${this.origin.x},${this.origin.y+this.height} L ${this.origin.x+this.width},${this.origin.y+this.height}`

        this.axisPathElement = <path d={d} fill="none" stroke="black" strokeWidth="0.2"/>

        let yLabels = []
        let xLabels = []

        let intervals = Math.ceil(this.maxY/this.yInterval)
        let heightGap = this.height/(intervals)
        let number = 0
        let h = 0

        this.pixelsPerUnitX = this.width/(props.labels.length+1)
        this.pixelsPerUnitY = this.height/(intervals*this.yInterval)

        this.barWidth = this.pixelsPerUnitX/2
        
        for(let i = 0; i <= intervals; i++){
            yLabels.push({x:`${this.origin.x-1}`, y:`${this.origin.y+this.height-h}`, key:`${number}`, innerHtml:number})
            //<text x={`${this.origin.x-1}`} y={`${this.origin.y+this.height-h}`} key={`${number}`} textAnchor="end" dominantBaseline="middle" style={{color:"lightgray", fontSize:"4px", transform:"rotate(-10deg)", transformBox: "fill-box", transformOrigin:"right"}}>{number}</text>
            number += this.yInterval
            h += heightGap
        }

        for(let i = 1; i <= props.labels.length; i++){
            let xEle = this.pixelsPerUnitX*i
            xLabels.push({x:`${this.origin.x+xEle}`, y:`${this.origin.y+this.height+2}`, key:`${props.labels[i-1]}`})
        }
        

        let legendX = this.origin.x+this.width+2;
        let baseLegendY = this.origin.y;

        let legend = []

        let q = 0
        for(let key in props.data){
            legend.push({color: props.data[key].color, key:key, x:legendX, y:baseLegendY+q*(this.legendSquareSide+1)})
            q++
        }

        this.setState({xLabels:xLabels, yLabels:yLabels, legend: legend})
    }

    async animatePlots(){

        for(let i = 0; i <= 100; i++){
            let funcVal = Math.sin((Math.PI/2)*i/100)

            for(let j = 0; j < this.state.plotObjects.length; j++){
                let data = this.props.data[this.state.plotObjects[j].key].value

                this.state.plotObjects[j].x = (this.origin.x+(j+1)*this.pixelsPerUnitX-this.barWidth/2)
                this.state.plotObjects[j].y = (this.origin.y+this.height-data*funcVal*this.pixelsPerUnitY)
                this.state.plotObjects[j].height = data*funcVal*this.pixelsPerUnitY
                
            }
            this.setState({plotObjects:this.state.plotObjects})
            await asyncTimer(10)
        }
    }

    triggerAnimationOnScrollIntoView(){
        let observer = new IntersectionObserver((entries)=>{
            if(entries[0].isIntersecting && !this.state.animated){
                this.animatePlots()
                this.setState({animated: true})
            }
        }, {threshold: [1]});

        observer.observe(document.getElementById(this.props.holderID));
    }

    calculateMaxY(props){
        for(let graph in props.data){
            if(!this.maxY || this.maxY < props.data[graph].value){
                this.maxY = props.data[graph].value;
            }
        }
    }

    calculateYInterval(){
        let i = 1;
        while(this.maxY/i > 10){
            i = i*10;
        }

        if(this.maxY > i*5){
            this.yInterval = i;
        }else{
            this.yInterval = i/2;
        }
    }

    onMouseOutBar(event){
        this.setState({hoverCardDetails:{...this.state.hoverCardDetails, style:{...this.state.hoverCardDetails.style, display:"none"}}})
    }
    
    onMouseOverBar(event, value){
        let barBoundingRect = event.currentTarget.getBoundingClientRect()
        let ancestorBoundingRect = event.currentTarget.parentNode.parentNode.getBoundingClientRect()
        let x = event.clientX-ancestorBoundingRect.left
        let y = event.clientY- ancestorBoundingRect.top-100

        this.state.hoverCardDetails.style = {display:"block", left: x.toString()+"px", top: y.toString()+"px"}
        // this.state.hoverCardDetails.style.left = x
        // this.state.hoverCardDetails.style.top = y
        this.state.hoverCardDetails.value = value
        this.setState({hoverCardDetails: this.state.hoverCardDetails})
    }

    render(){
        return (<div style={{position:"relative", width:"100%", height:"100%"}}>
            <svg width="100%" height="100%" viewBox={`0 0 ${this.viewBox.width} ${this.viewBox.height}`}>
                {this.axisPathElement}
                <text x={`${this.origin.x+this.width/2}`} y={`${this.origin.y+this.height+this.padding.bottom-5}`} textAnchor="middle" style={{fontSize:"5px"}}>{this.props.desc}</text>
                {this.state.yLabels.map((yLabel)=>{
                    return <text x={yLabel.x} y={yLabel.y} key={yLabel.key} textAnchor="end" dominantBaseline="middle" style={{fill:"black", fontSize:"4px", transform:"rotate(-10deg)", transformBox: "fill-box", transformOrigin:"right"}}>{yLabel.innerHtml}</text>
                })}
                {this.state.xLabels.map((xLabel)=>{
                    return <text y={xLabel.y} x={xLabel.x} dominantBaseline="hanging" textAnchor="middle" key={xLabel.key} style={{fontSize:"4px"}}>{xLabel.key}</text>
                })}

                {this.state.legend.map((leg)=>{
                    return <g key={`${leg.key}legend`}>
                            <rect x={`${leg.x}`} y={`${leg.y}`} width={`${this.legendSquareSide}`} height={`${this.legendSquareSide}`} fill={leg.color}/>    
                            <text x={`${leg.x+this.legendSquareSide+1}`} y={`${leg.y}`} dominantBaseline="hanging" fontSize={(this.legendSquareSide).toString()}>{leg.key}</text>
                    </g>
                })}

                {this.state.plotObjects.map((obj)=>{
                    return <rect x={`${obj.x}`} y={`${obj.y}`} height={`${obj.height}`} width={`${this.barWidth?this.barWidth:0}`} stroke="none" fill={obj.color} key={obj.key} onMouseOver={(event)=>{
                        this.onMouseOverBar(event, this.props.data[obj.key].value)
                    }} onMouseOut={this.onMouseOutBar.bind(this)}/>
                    //<path d={obj.path} stroke={obj.color} strokeWidth='0.5' fill='none' key={obj.key}/>
                })}
            </svg>
            <div className="hoverCardBar" style={this.state.hoverCardDetails.style}>
                <div>{this.state.hoverCardDetails.value}</div>
            </div>
        </div>)
    }
}

export default BarChart;
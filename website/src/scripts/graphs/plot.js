import React from 'react'
import "../../style/charts/plot.css"
import asyncTimer from '../asyncTimer';
import '../../style/charts/plot.css'

class Plot extends React.Component{
    constructor(props){
        super(props);
        this.props = props;

        this.viewBox = {height: 100, width:200}
        this.padding = {left: 25, right: 22, top: 5, bottom: 20} 

        this.origin = {x:this.padding.left, y:this.padding.top}
        this.height = this.viewBox.height-this.padding.top-this.padding.bottom
        this.width = this.viewBox.width-this.padding.left-this.padding.right
        this.legendSquareSide = 3

        let plotObjects = []
        let points = []
        let hoverCardInfo = []

        for(let key in this.props.data){
            plotObjects.push({color: this.props.data[key].color, path: '', key: key})
            points.push({color: this.props.data[key].color, key: key, show:false, x: 0,  y:0})
            hoverCardInfo.push({key: key, color: this.props.data[key].color, value: 0})
        }

        this.state = {plotObjects: plotObjects, animated: false, points: points, hoverCardDetails:{style:{display:"none"}, label:""}, hoverCardInfo: hoverCardInfo, yLabels: [], xLabels:[], legend: []}
    }

    componentDidMount(){
        this.drawAxes(this.props)
        this.triggerAnimationOnScrollIntoView()
    }

    shouldComponentUpdate(nextProps, nextState){
        if(nextState == this.state && this.props != nextProps){
            let plotObjects = []
            let points = []
            let hoverCardInfo = []

            for(let key in nextProps.data){
                plotObjects.push({color: nextProps.data[key].color, path: '', key: key})
                points.push({color: nextProps.data[key].color, key: key, show:false, x: 0,  y:0})
                hoverCardInfo.push({key: key, color: nextProps.data[key].color, value: 0})
            }
            let animated = false
            if(document.getElementById(nextProps.holderID).getBoundingClientRect().top < window.innerHeight){
                animated = true
            }

            this.setState({animated:animated, plotObjects: plotObjects, points: points, hoverCardInfo: hoverCardInfo,})
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

        this.pixelsPerUnitX = this.width/props.labels.length
        this.pixelsPerUnitY = this.height/(intervals*this.yInterval)
        
        for(let i = 0; i <= intervals; i++){
            yLabels.push({x:`${this.origin.x-1}`, y:`${this.origin.y+this.height-h}`, key:`${number}`, innerHtml:number})
            //<text x={`${this.origin.x-1}`} y={`${this.origin.y+this.height-h}`} key={`${number}`} textAnchor="end" dominantBaseline="middle" style={{color:"lightgray", fontSize:"4px", transform:"rotate(-10deg)", transformBox: "fill-box", transformOrigin:"right"}}>{number}</text>
            number += this.yInterval
            h += heightGap
        }

        if(props.labels.length <= 5 || props.labels.length > 50){
            let xIntervals = props.labels.length>5?5:props.labels.length;
            let pixelsPerUnit = this.width/props.labels.length;
            let lengthGap = props.labels.length/xIntervals;
            let l = 0

            for(let i = 0; i < xIntervals  && Math.ceil(l) < props.labels.length; i++){
                let xEle = pixelsPerUnit*(Math.ceil(l)+1)
                xLabels.push({x:`${this.origin.x+xEle}`, y:`${this.origin.y+this.height+2}`, key:`${props.labels[Math.ceil(l)]}`})
                //<text y={`${this.origin.y+this.height+2}`} x={`${this.origin.x+xEle}`} dominantBaseline="hanging" textAnchor="middle" key={`${this.props.labels[Math.ceil(l)]}`} style={{fontSize:"4px"}}>{this.props.labels[Math.ceil(l)]}</text>
                l += lengthGap
            }
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
        let totalLabels = this.props.labels.length
        let maxPlotValue = this.yInterval*Math.ceil(this.maxY/this.yInterval)

        let pixelsPerUnitY = this.height/maxPlotValue
        let pixelsPerUnitX = this.width/totalLabels

        for(let i = 0; i <= 100; i++){
            let funcVal = Math.sin((Math.PI/2)*i/100)

            for(let j = 0; j < this.state.plotObjects.length; j++){
                let data = this.props.data[this.state.plotObjects[j].key].values

                let d = ''
                for(let k = 0; k < data.length; k++){
                    if(k == 0){
                        d += `M ${this.origin.x+pixelsPerUnitX*(k+1)},${this.origin.y+this.height-funcVal*pixelsPerUnitY*data[k]} `
                    }else{
                        d += `L ${this.origin.x+pixelsPerUnitX*(k+1)},${this.origin.y+this.height-funcVal*pixelsPerUnitY*data[k]} `
                    }
                }

                this.state.plotObjects[j].path = d;
                
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
            for(let val of props.data[graph].values){
                if(!this.maxY || this.maxY < val){
                    this.maxY = val;
                }
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

    onMouseMoveSVG(event){
        let svgWidth = event.currentTarget.clientWidth;
        let ratio = this.viewBox.width/svgWidth

        let parent = event.currentTarget.parentNode;
        let parentClientRect = parent.getBoundingClientRect()

        let mouseX = (event.clientX-event.currentTarget.getBoundingClientRect().left)*ratio

        if(mouseX > this.origin.x && mouseX <= this.origin.x + this.width){
            let points = this.state.points
            let hoverCardInfo = this.state.hoverCardInfo

            let roundedVal = Math.round((mouseX-this.origin.x)/this.pixelsPerUnitX)

            let labelUnit = roundedVal > this.props.labels.length?this.props.labels.length:roundedVal
            labelUnit = labelUnit <= 0?1:labelUnit

            let maxVal = 0
            
            for(let i = 0; i < points.length; i++){
                points[i].show = true
                points[i].x = labelUnit*this.pixelsPerUnitX + this.origin.x
                points[i].y = this.origin.y+this.height-this.props.data[points[i].key].values[labelUnit-1]*this.pixelsPerUnitY
                if(maxVal < this.props.data[points[i].key].values[labelUnit-1]){
                    maxVal = this.props.data[points[i].key].values[labelUnit-1]
                }
                hoverCardInfo[i].value = this.props.data[hoverCardInfo[i].key].values[labelUnit-1]
            }

            let xSvg = (labelUnit*this.pixelsPerUnitX + this.origin.x)/ratio
            let ySvg = (this.origin.y+this.height-maxVal*this.pixelsPerUnitY)/ratio

            let xSvgParent = event.currentTarget.getBoundingClientRect().left - parentClientRect.left + xSvg
            let ySvgParent = event.currentTarget.getBoundingClientRect().top - parentClientRect.top + ySvg

            let yPositionHover = {}
            if(event.clientY-event.currentTarget.getBoundingClientRect().top > ySvg){
                yPositionHover = {bottom: (parent.clientHeight-ySvgParent+30).toString()+"px"}
            }else{
                yPositionHover = {top: (ySvgParent+30).toString()+"px"}
            }

            let hoverElementProps = {...this.state.hoverCardDetails.style, display:"block", left: (xSvgParent).toString()+"px", bottom:yPositionHover.bottom, top:yPositionHover.top}

            this.setState({points: points, hoverCardDetails: {style:hoverElementProps, label: this.props.labels[labelUnit-1]}, hoverCardInfo: hoverCardInfo})
        }
    }

    onMouseOut(event){
        for(let point of this.state.points){
            point.show = false;
        }

        this.setState({points: this.state.points, hoverCardDetails:{...this.state.hoverCardDetails, style:{...this.state.hoverCardDetails.style, display:"none"}}})
    }

    render(){
        return (<div style={{position:"relative", width:"100%", height:"100%"}}>
            <svg width="100%" height="100%" viewBox={`0 0 ${this.viewBox.width} ${this.viewBox.height}`} onMouseMove={this.onMouseMoveSVG.bind(this)} onMouseOut={this.onMouseOut.bind(this)}>
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
                    return <path d={obj.path} stroke={obj.color} strokeWidth='0.5' fill='none' key={obj.key}/>
                })}
                {this.state.points.map((point)=>{
                    if(point.show){
                        return <circle cx={`${point.x}`} cy={`${point.y}`} r="1" fill={point.color} key={`${point.key}point`} stroke="none"/>
                    }
                    return null;
                })}
            </svg>
            <div className="hoverCardPlot" style={this.state.hoverCardDetails.style}>
                <div style={{marginBottom:"4px", color:"white"}}>{this.state.hoverCardDetails.label}</div>
                {this.state.hoverCardInfo.map((info)=>{
                    return (<div style={{display:"flex", alignItems:"center", marginBottom:"3px"}} key={info.key}>
                        <div style={{height:"20px", width:"20px", backgroundColor:info.color, border: "2px solid white", marginRight:"2px"}}></div>
                        <div style={{color:"white", fontSize:"0.8em"}}>{info.value}</div>
                    </div>)
                })}
            </div>
        </div>)
    }
}

export default Plot;
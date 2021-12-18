import React from 'react'
import asyncTimer from '../asyncTimer';
import '../../style/charts/piechart.css'

class PieChart extends React.Component{
    constructor(props){
        super(props);
        this.props = props;

        this.gapDegree = 0.5, this.padding = 10;
        this.paths = [];
        this.state = {animated: false};
    }

    componentDidMount(){
        this.addHoverEventListener();
        this.triggerAnimationOnScrollIntoView();
    }

    shouldComponentUpdate(nextProps, nextState){
        if(nextState.animated != this.state.animated){
            return false;
        }
        if(nextProps != this.props){
            this.resetPaths();
            this.setState({animated: false})
        }
        return true;
    }

    componentDidUpdate(prevProps, prevState){
        if(prevProps != this.props){
            this.addHoverEventListener();
            this.triggerAnimationOnScrollIntoView();
        }
    }

    initialRender(){
        this.paths=[];
        for(let field of this.props.fields){
            this.paths.push(<path key={field.name} stroke={field.color} strokeWidth="10" fill="none" id={`${this.props.id}${field.name}`} pointerEvents="all"/>);
        }
    }

    async animateEntry(){
        let starting = {x: 50, y: this.padding}, ending = {}, previousAngle = 0, radius = 50-this.padding;
        let fieldIndex = 0;
        for(let j = 1; j <= 100 && fieldIndex < this.props.fields.length; j++){
            let angle = 100*Math.pow(Math.sin((j/100)*Math.PI/2), 1.5);
            if(angle >= previousAngle + this.props.fields[fieldIndex].part-this.gapDegree){
                previousAngle += this.props.fields[fieldIndex].part;

                let x = Math.sin(2*Math.PI*(previousAngle-this.gapDegree)/100)*radius + 50;
                let y = 50-1*Math.cos(2*Math.PI*(previousAngle-this.gapDegree)/100)*radius;

                document.getElementById(`${this.props.id}${this.props.fields[fieldIndex].name}`).setAttribute("d", 
                `M ${starting.x} ${starting.y} A ${radius} ${radius} 0 ${this.props.fields[fieldIndex].part-this.gapDegree>50?1:0} 1 ${x} ${y}`);

                fieldIndex++;
                if(fieldIndex >= this.props.fields.length){
                    break;
                }
                starting.x = Math.sin(2*Math.PI*(previousAngle)/100)*radius + 50;
                starting.y = 50-1*Math.cos(2*Math.PI*(previousAngle)/100)*radius;
            }

            let field = this.props.fields[fieldIndex];
            let path = document.getElementById(`${this.props.id}${field.name}`);
            
            let largeArcFlag = angle-previousAngle>50?1:0;

            ending.x = Math.sin(2*Math.PI*(angle)/100)*radius + 50;
            ending.y = 50-1*Math.cos(2*Math.PI*(angle)/100)*radius;
            
            let d = `M ${starting.x} ${starting.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${ending.x} ${ending.y}`;

            path.setAttribute("d", d)

            await asyncTimer(10);

        }
    }

    addHoverEventListener(){
        let pathElements = this.props.fields.map((field)=>{
            let ele = document.getElementById(`${this.props.id}${field.name}`); 
            ele.fieldName = field.name;
            ele.fieldPart = field.part;
            return ele;
        })

        let mainElement = document.getElementById(`${this.props.id}main`);
        let hoverElement = document.getElementById(`${this.props.id}hover`);

        for(let pathElement of pathElements){
            pathElement.style.transition = "transform 0.5s linear";
            pathElement.style.transformOrigin = "center";

            pathElement.onmouseover = function(event){
                event.target.style.filter = "drop-shadow( 1.5px 1.5px 1px rgba(169, 169, 169, 1))"
                event.target.style.transform = "scale(1.05)";

                event.currentTarget.style.filter = "drop-shadow( 1.5px 1.5px 1px rgba(169, 169, 169, 1))"
                event.currentTarget.style.transform = "scale(1.05)";

            }
            pathElement.onmouseout = function(event){
                event.target.style.filter = "drop-shadow( 0px 0px 1px rgba(0, 0, 0, 0))"
                event.target.style.transform = "scale(1)";

                event.currentTarget.style.filter = "drop-shadow( 0px 0px 1px rgba(0, 0, 0, 0))"
                event.currentTarget.style.transform = "scale(1)";

                hoverElement.style.display = "none";
            }

            pathElement.onmousemove = function(event){
                let x = event.clientX-mainElement.getBoundingClientRect().left;
                let y = event.clientY-mainElement.getBoundingClientRect().top;    

                hoverElement.style.display = "flex";
                hoverElement.style.left = (x+10).toString() + "px";
                hoverElement.style.top = (y-hoverElement.clientHeight-30).toString() + "px";

                let hoverContentElements = hoverElement.children;
                hoverContentElements[1].children[0].innerHTML = `${pathElement.fieldName}`;
                hoverContentElements[1].children[1].innerHTML = `${pathElement.fieldPart}%`;
            }
        }
    }

    triggerAnimationOnScrollIntoView(){
        let observer = new IntersectionObserver((entries)=>{
            if(entries[0].isIntersecting && !this.state.animated){
                this.animateEntry();
                this.setState({animated: true})
            }
        }, {threshold: [1]});

        observer.observe(document.getElementById(`${this.props.id}main`));
    }

    resetPaths(){
        //console.log(document.getElementById(`${this.props.id}chart`));
        //document.getElementById(`${this.props.id}chart`).innerHTML = null;
        for(let i = 0; i < this.props.fields.length; i++){
            let pth = document.getElementById(`${this.props.id}${this.props.fields[i].name}`);
            if(pth){
                pth.setAttribute("d", "");
            }
        }
    }

    render(){
        this.initialRender();
        return (<div style={{width:"100%", height:"100%", position:"relative"}} id={`${this.props.id}main`}>
            <svg width="100%" height="100%" viewBox="0 0 100 100">
                <clipPath id={`${this.props.id}removeExcess`}>
                    <circle cx="50" cy="50" r="50"/>
                </clipPath>
                <def>
                    <g id={`${this.props.id}chart`}>
                        {this.paths}
                    </g>
                </def>
                <use clipPath={`url(#${this.props.id}removeExcess)`} xlinkHref={`#${this.props.id}chart`} onMouseMove={()=>{console.log("moving")}}/>
            </svg>
            <div className="hoverCardPie" id={`${this.props.id}hover`}>
                <span style={{whiteSpace:"nowrap"}}>{this.props.desc}</span>
                <div className="hoverCardBody">
                    <span></span>
                    <span style={{marginLeft:"4px"}}></span>
                </div>
            </div>
        </div>);
    }
}

export default PieChart;
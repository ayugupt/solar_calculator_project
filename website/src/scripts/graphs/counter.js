import React from 'react'
import '../../style/charts/counter.css'
import asyncTimer from '../asyncTimer'

class Counter extends React.Component{
    constructor(props){
        super(props)
        this.props = props
        this.ref = React.createRef()
        this.state = {animated: false}
    }

    componentDidMount(){
        this.setCounter()
        this.triggerAnimationOnScrollIntoView()
    }

    componentDidUpdate(prevProps, prevState, snapshot){
        if(this.props != prevProps && this.state == prevState){
            this.setState({animated: false})

            this.counterSpan.style.transform = ""
            this.counterSpan.style.top = ""
            this.divParent.style.width = ""
            this.divParent.style.height = ""
            this.divParent.style.marginLeft = ""

            this.setCounter()
            this.triggerAnimationOnScrollIntoView()
        }
    }

    setCounter(){
        this.divParent = this.ref.current;
        this.counterSpan = this.divParent.children[0]
        this.ancestor = this.divParent.parentNode;

        let divParentBoundingClientRect = this.divParent.getBoundingClientRect()
        let counterSpanBoundingClientRect = this.counterSpan.getBoundingClientRect()

        //this.divParent.style.height = counterSpanBoundingClientRect.height.toString() + "px"
        this.counterSpan.style.top = ((divParentBoundingClientRect.height-counterSpanBoundingClientRect.height)/2).toString()+"px"

        let widthRatio = (divParentBoundingClientRect.width)/(counterSpanBoundingClientRect.width);
        let heightRatio = (divParentBoundingClientRect.height)/(counterSpanBoundingClientRect.height);

        let ratio = widthRatio<heightRatio?widthRatio:heightRatio;
        this.counterSpan.style.transform = `scale(${ratio}, ${ratio})`

        counterSpanBoundingClientRect = this.counterSpan.getBoundingClientRect()

        this.divParent.style.height = counterSpanBoundingClientRect.height.toString() + "px"
        this.divParent.style.width = counterSpanBoundingClientRect.width.toString() + "px"

        divParentBoundingClientRect = this.divParent.getBoundingClientRect()
        let ancestorBoundingClientRect = this.ancestor.getBoundingClientRect()

        let leftOverSpace = ancestorBoundingClientRect.width - divParentBoundingClientRect.width
        this.divParent.style.marginLeft = (Math.round(leftOverSpace*0.2)).toString() + "px"

        this.updateCounter(0)
    }

    updateCounter(number){
        this.counterSpan.innerHTML = number
    }

    async animateCounter(number){
        for(let i = 0; i <= 500; i++){
            this.updateCounter(Math.round(number*Math.sin(i*Math.PI/1000)))
            //this.updateCounter(Math.round(number*(3-0.65*Math.pow(i*Math.sqrt(3/0.65)/100, 2))/3))
            await asyncTimer(Math.round(10*i/500))
        }
    }

    triggerAnimationOnScrollIntoView(){
        let observer = new IntersectionObserver((entries)=>{
            if(entries[0].isIntersecting && !this.state.animated){
                this.animateCounter(this.props.number)
                this.setState({animated: true})
            }
        }, {threshold: [1]});

        observer.observe(this.ref.current);
    }

    render(){
        return (
            <div className="counterAndTitle">
                <div className="counterHeading">{this.props.heading}</div>
                <div className="counterParent" ref={this.ref}>
                    <span className="counterText" style={{color:this.props.color}}>{this.props.number}</span>
                    <div className="counterTitle">{this.props.title}</div>
                </div>
            </div>
        )
    }
}

export default Counter;
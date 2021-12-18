import React from 'react'

class Button extends React.Component{
    constructor(props){
        super(props);
        this.props = props;
        this.r = true;
        this.t = false;
        this.objRef = React.createRef();
        this.highlightColor = "#2e4feb";

        this.mainRef = React.createRef();
    }

    componentDidUpdate(prevProps){
        if(this.t && this.props.hold && (prevProps.change != this.props.change)){
            this.holdAnim(this.mainRef.current.querySelector(".buttonDecorClick"), this.objRef.current.contentDocument.getElementsByTagName("path"));
            this.t = !this.t;     
        }
    }

    onMouseDown(event){
        this.r = false;
        if(!this.props.hold || !this.t){
            let x = event.clientX-event.currentTarget.getBoundingClientRect().left;
            let y = event.clientY - event.currentTarget.getBoundingClientRect().top;
            let currTar = event.currentTarget;
            
            let dec = event.currentTarget.querySelector(".buttonDecorClick");
            dec.style.display = "block";
            dec.style.left = x.toString() + "px";
            dec.style.top = y.toString() + "px";


            dec.style.left = (x-currTar.clientWidth).toString() + 'px';
            dec.style.top = (y-currTar.clientHeight).toString() + 'px';

            dec.style.height = "200%";
            dec.style.width = "200%";
            dec.style.opacity = "1";
        }
    }

    onMouseUporOut(event){
        if(!this.r){
            this.r = true;
            let ele = event.currentTarget.querySelector(".buttonDecorClick");
            let objNodeDoc = this.objRef.current.contentDocument;
            let paths = objNodeDoc.getElementsByTagName("path");

            this.props.action(event);
            
            if(!this.props.hold || this.t){
                this.holdAnim(ele, paths);
            }

            if(this.props.hold && !this.t){
                for(let path of paths){
                    path.style.fill = this.highlightColor
                }
            }

            this.t = this.t==true?false:true;
        }
        
    }

    holdAnim(ele, paths){
        window.setTimeout(()=>{
            ele.style.opacity = "0";
            window.setTimeout(()=>{
                ele.style = {display: "none", width:"0", height:"0", left:null, right:null, ...ele.style}
                if(this.props.hold){
                    for(let path of paths){
                        path.style.fill = "black"
                    }
                }
            }, 200)
        }, 200)
    }

    render(){
        return <div style={this.props.style.main} className="button" onMouseDown={this.onMouseDown.bind(this)} onMouseUp={this.onMouseUporOut.bind(this)} onMouseOut={this.onMouseUporOut.bind(this)} ref={this.mainRef}>
            <div className="buttonDecorHover" style={this.props.style.hover}></div>
            <div className="buttonDecorClick" style={this.props.style.click}></div>
            <div className="buttonIcon">
                <object data={this.props.iconSrc}  width="60%" height="60%" draggable={false} style={{userSelect:false}} ref={this.objRef}/>
                <div style={{position:"absolute", height:"100%", width:"100%"}}></div>
            </div>
        </div>
    }
}

export default Button;
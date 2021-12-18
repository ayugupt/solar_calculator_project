import React from 'react';

class AreaCanvas extends React.Component{
    constructor(props){
        super(props);
        this.props = props;
        this.canvasRef = React.createRef();
    }

    componentDidMount(){
        this.drawCanvas();
        window.onresize = this.drawCanvas.bind(this);

    }

    componentDidUpdate(){
        this.drawCanvas();
    }

    drawCanvas(){
        this.canvasRef.current.height = this.canvasRef.current.clientHeight.toString();
        this.canvasRef.current.width = this.canvasRef.current.clientWidth.toString();
        let cntxt = this.canvasRef.current.getContext('2d');

        let margin = 5;

        let height = this.canvasRef.current.clientHeight-2*margin;
        let width = this.canvasRef.current.clientWidth-2*margin;

        cntxt.clearRect(0, 0, width, height);

        cntxt.fillStyle = "blue";
        for(let i = 0; i <= width; i+=4){
            for(let j = 0; j <= height; j+= 3){
                cntxt.beginPath();
                cntxt.arc(i, j, 1, 0, 2*Math.PI);
                cntxt.closePath();
                cntxt.fill();
            }
        }

        let min = {}, max = {};
        for(let coord of this.props.coordinates){
            if(!min.x || min.x > coord.x){
                min.x = coord.x;
            }
            if(!min.y || min.y > coord.y){
                min.y = coord.y;
            }
            if(!max.x || max.x < coord.x){
                max.x = coord.x;
            }
            if(!max.y || max.y < coord.y){
                max.y = coord.y;
            }
        }

        let maxDiff;
        let pixelsPerUnit;
        let paddingX = 0, paddingY = 0;
        if((max.x-min.x)>(max.y-min.y)){
            maxDiff = max.x-min.x;
            pixelsPerUnit = width/maxDiff;
            paddingY = height-pixelsPerUnit*(max.y-min.y);
        }else{
            maxDiff = max.y-min.y;
            pixelsPerUnit = height/maxDiff;
            paddingX = width-pixelsPerUnit*(max.x-min.x);
        }

        cntxt.strokeStyle = "black";
        cntxt.lineWidth = 3;
        cntxt.setLineDash([10, 2])
        cntxt.globalCompositeOperation = "destination-in";
        cntxt.fillStyle = "black";
        cntxt.beginPath();
        let first = true;
        for(let coord of this.props.coordinates){
            coord.x = coord.x-min.x;
            coord.y = coord.y-min.y;

            let x = margin/2+paddingX/2+coord.x*pixelsPerUnit, y = margin/2+paddingY/2+coord.y*pixelsPerUnit; 

            if(first){
                cntxt.moveTo(x, y);
                first = false;
            }else{
                cntxt.lineTo(x, y)
            }
        }

        cntxt.closePath();
        cntxt.fill();
        cntxt.globalCompositeOperation = "source-over";
        cntxt.stroke();
    }

    render(){
        return (<canvas style={{height:"100%", width:"100%"}} ref={this.canvasRef}>
        </canvas>);
    }
    
}

export default AreaCanvas;
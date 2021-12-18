import React from 'react'
import MapToolBar from './maptoolbar';
import Button from '../button';
import {CSSTransition} from 'react-transition-group';
import asyncGetCurrentPosition from '../asyncGetCurrentPosition.js';

const SelectionTool = {
    Rect: 1, 
    Polygon: 2
}

class Map extends React.Component{
    constructor(props){
        super(props);
        this.props = props;

        this.mapRef = React.createRef();
        this.selectionAreaRef = React.createRef();
        this.selectionWrapperRef = React.createRef();
        this.polygonSelectionRef = React.createRef();
        this.polygonSelectionHelperRef = React.createRef();
        this.selectionMadeRef = React.createRef();

        this.selectionNode = null;
        this.selectionWrapper = null;
        this.polygonSelectionNode = null;
        this.polygonSelectionHelperNode = null;

        this.map = null;

        this.start = null;
        this.end = null;

        this.buttons = [{iconSrc:"/images/select.svg", action: this.selectMode.bind(this), hold:true, id:"select", style: {}, change:false},
                        {iconSrc:"/images/zoomin.svg", hold: false, id:"zoomin", style: {}, action: this.zoomIn.bind(this)},
                        {iconSrc:"/images/zoomout.svg", hold: false, id:"zoomout", style: {}, action: this.zoomOut.bind(this)},
                        {iconSrc:"/images/locateme.svg", hold: false, id:"currentlocation", style: {}, action: this.getCurrentLocation.bind(this)}];

        this.selectionToolButtons = [{iconSrc:"/images/rectselect.svg", hold:true, change: false, id:"rectSelect", action:this.rectSelect.bind(this), style:{}},
                                     {iconSrc:"/images/polygonselect.svg", hold:true, change: false, id:"polygonSelect", action:this.polygonSelect.bind(this), style:{}}];

        this.down = false;
        let animations = {selectTools: {in: true, time: 150}};
        this.state = {select: false, selectionTool: null, animations: animations};
        this.selectionMade = false;

        window.addEventListener("load", this.onLoad.bind(this));
        this.maxDistForSnap = 20;
    }


    componentDidMount(){
        this.selectionNode = this.selectionAreaRef.current;
        this.selectionWrapper = this.selectionWrapperRef.current;
    }

    componentDidUpdate(){
        if(this.selectionAreaRef.current){
            this.selectionNode = this.selectionAreaRef.current;
        }
        if(this.selectionWrapperRef.current){
            this.selectionWrapper = this.selectionWrapperRef.current;
        }
        if(this.polygonSelectionRef.current){
            this.polygonSelectionNode = this.polygonSelectionRef.current;
            this.polygonSelectionNode.width = this.polygonSelectionNode.clientWidth;
            this.polygonSelectionNode.height = this.polygonSelectionNode.clientHeight;
            this.polygonSelectionHelperNode = this.polygonSelectionHelperRef.current;
            this.polygonSelectionHelperNode.width = this.polygonSelectionHelperNode.clientWidth;
            this.polygonSelectionHelperNode.height = this.polygonSelectionHelperNode.clientHeight;
        }
    }

    //Toolbar button actions
    selectMode(){
        this.state.select?this.exitSelectMode():this.enterSelectMode();
    }

    zoomIn(){
        let val = this.map.getCamera().zoom+1;
        this.map.setCamera({zoom: val});
    }

    zoomOut(){
        let val = this.map.getCamera().zoom-1;
        this.map.setCamera({zoom: val})
    }

    async getCurrentLocation(){
        try{
            let result = await asyncGetCurrentPosition();
            this.map.setCamera({
                center: [result.coords.longitude, result.coords.latitude]
            })
        }catch(error){
            console.log(error);
        }
        
    }
    //--------------

    //window onLoad event
    async onLoad(event){
        //let p = await asyncGetCurrentPosition();
        let mapNode = this.mapRef.current;
        this.map = new atlas.Map(mapNode, {
            center: [77.1025, 28.7041],
            view: 'Auto',
            zoom: 10, 
            minZoom: 10,
            authOptions: {
                authType:"subscriptionKey",
                subscriptionKey: "oSyNpTEwFAk4JqlLJp8zXQIrEhjVaR4z03cfkYpmtec"
        }})
        //this.map = new Microsoft.Maps.Map(mapNode, {showMapTypeSelector: false, showZoomButtons: false, showLocateMeButton: false});
        //this.map.setMapType(Microsoft.Maps.MapTypeId.aerial);
    }
    //-------------

    //select wrapper events
    onMouseDown(event){
        event.stopPropagation();
        if(this.state.selectionTool == SelectionTool.Rect){
            this.rectOnMouseDown(event);
        }
        
    }

    onMouseMove(event){
        event.stopPropagation();
        if(this.state.selectionTool == SelectionTool.Rect){
            this.rectOnMouseMove(event);
        }else if(this.state.selectionTool == SelectionTool.Polygon){
            this.polygonOnMouseMove(event);
        }
    }

    onMouseUp(event){
        event.stopPropagation();
        if(this.state.selectionTool == SelectionTool.Rect){
            this.rectOnMouseUp(event);
        }
    }

    onMouseClick(event){
        event.stopPropagation();
        if(this.state.selectionTool == SelectionTool.Polygon){
            this.polygonOnMouseClick(event);
        }
    }
    //--------------------

    //selection tools events

    //rect select
    rectOnMouseDown(event){
        this.down = true;
        this.removeSelectArea();

        let selectionWrapperNode = event.currentTarget;

        let xvp = event.clientX, yvp = event.clientY;
        let x = xvp-selectionWrapperNode.getBoundingClientRect().left;
        let y = yvp-selectionWrapperNode.getBoundingClientRect().top;

        this.start = {x: xvp, y: yvp};

        this.selectionNode.style.display = "block";
        this.selectionNode.style.left = x.toString() + "px";
        this.selectionNode.style.top = y.toString() + "px";
    }

    rectOnMouseMove(event){
        if(this.down){
            let width = event.clientX-this.start.x;
            let height = event.clientY-this.start.y;
            if(width < 0){
                width = -1*width;
                this.selectionNode.style.left = (event.clientX-this.selectionWrapper.getBoundingClientRect().left).toString() + "px";
            }
            if(height < 0){
                height = -1*height;
                this.selectionNode.style.top = (event.clientY-this.selectionWrapper.getBoundingClientRect().top).toString() + "px";
            }
            this.selectionNode.style.width = width.toString() + "px";
            this.selectionNode.style.height = height.toString() + "px";
        }
    }

    rectOnMouseUp(event){
        let parentX = event.currentTarget.getBoundingClientRect().left;
        let parentY = event.currentTarget.getBoundingClientRect().top;

        let x = event.clientX-parentX;
        let y = event.clientY-parentY;

        this.end = {x: event.clientX, y: event.clientY}
        this.down = false;
        if(this.end.x == this.start.x && this.end.y == this.start.y){
            this.removeSelectArea();
        }else{
            this.selectionDone();
        }

        this.start.x = this.start.x-parentX;
        this.start.y = this.start.y-parentY;

        this.end.x = x;
        this.end.y = y;
    }

    //~~rect select

    //polygon select
    polygonOnMouseClick(event){
        let ctxt = this.polygonSelectionNode.getContext("2d");

        if(this.selectionMade){
            this.removeSelectArea();
            ctxt.clearRect(0, 0, event.currentTarget.clientWidth, event.currentTarget.clientHeight)
        }else{
            let x = event.clientX - event.currentTarget.getBoundingClientRect().left;
            let y = event.clientY - event.currentTarget.getBoundingClientRect().top;
            
            ctxt.fillStyle = "blue";
            ctxt.strokeStyle = "black"

            if(this.snapPoint){
                x = this.snapPoint.x;
                y = this.snapPoint.y;

                let ctx = this.polygonSelectionHelperNode.getContext('2d')
                ctx.clearRect(0, 0, event.currentTarget.clientWidth, event.currentTarget.clientHeight);
                this.snapPoint = null;      
                this.selectionDone();
            }else{
                ctxt.beginPath();
                ctxt.arc(x, y, 5, 0, 2*Math.PI);
                ctxt.closePath();
                ctxt.fill()
            }

            if(this.prevPoints && this.prevPoints.length > 0){
                ctxt.globalCompositeOperation='destination-over';
                ctxt.beginPath();
                ctxt.moveTo(this.prevPoints.at(-1).x, this.prevPoints.at(-1).y);
                ctxt.lineTo(x, y);
                ctxt.stroke()
            }else{
                this.prevPoints = [];
            }

            this.prevPoints.push({x: x, y: y});
        }
    }

    polygonOnMouseMove(event){
        if(this.prevPoints && this.prevPoints.length > 0 && !this.selectionMade){
            let x = event.clientX-event.currentTarget.getBoundingClientRect().left;
            let y = event.clientY-event.currentTarget.getBoundingClientRect().top;
            
            let ctxt = this.polygonSelectionHelperNode.getContext("2d");
            ctxt.clearRect(0, 0, event.currentTarget.clientWidth, event.currentTarget.clientHeight);

            ctxt.fillStyle = "blue";
            ctxt.strokeStyle = "black"
            this.snapPoint = null;
            for(let point of this.prevPoints){
                if(Math.sqrt((x-point.x)*(x-point.x) + (y-point.y)*(y-point.y)) <= 20){
                    x = point.x;
                    y = point.y;
                    this.snapPoint = point;
                    break;
                }
            }

            ctxt.globalCompositeOperation = "destination-over";
            ctxt.beginPath();
            ctxt.arc(x, y, 5, 0, 2*Math.PI);
            ctxt.closePath();
            ctxt.fill();

            ctxt.beginPath();
            ctxt.moveTo(x, y);
            ctxt.lineTo(this.prevPoints.at(-1).x, this.prevPoints.at(-1).y);
            ctxt.closePath()
            ctxt.stroke();
        }
    }
    //~~polygon select

    //--------------------

    //Selection functions
    confirmSelect(){
        let mapPolygon;
        if(this.state.selectionTool == SelectionTool.Rect){
            let pointArray = [new atlas.Pixel(this.start.x, this.start.y), new atlas.Pixel(this.end.x, this.start.y),
                                new atlas.Pixel(this.end.x, this.end.y), new atlas.Pixel(this.start.x, this.end.y), new atlas.Pixel(this.start.x, this.start.y)];
            this.areaPoints = pointArray;
            mapPolygon = new atlas.data.Polygon(this.map.pixelsToPositions(this.areaPoints));
        }
        else if(this.state.selectionTool == SelectionTool.Polygon){
            this.prevPoints.slice(0, this.prevPoints.length-2)
            this.areaPoints = this.prevPoints.map((point)=>{
                return new atlas.Pixel(point.x, point.y);
            });
            mapPolygon = new atlas.data.Polygon(this.map.pixelsToPositions(this.areaPoints));
        }
        this.buttons[0].change = !this.buttons[0].change;
        this.mapAreaSelectedPolygon = mapPolygon; 

        let dataSource = new atlas.source.DataSource();
        this.map.sources.add(dataSource)

        let source = new atlas.data.Feature(mapPolygon);
        let layer = new atlas.layer.PolygonLayer(dataSource, null, {
            fillColor:"red",
            fillOpacity:0.4
        });

        this.sourceID = source.id;
        this.layerID = layer.id;

        dataSource.add(source)
        this.map.layers.add(layer, 'labels');

        this.exitSelectMode();
        this.onSelectExtraFunc()
    }

    removeSelectArea(){
        if(this.selectionMade){
            if(this.state.selectionTool == SelectionTool.Rect){
                this.selectionNode.style.width = "0";
                this.selectionNode.style.height = "0";
                this.selectionNode.style.display = "none";
                this.start = null, this.end = null;
            }else if(this.state.selectionTool == SelectionTool.Polygon){
                this.prevPoints = null;
                this.snapPoint = null;
            }
        }
        this.selectionRemoved();
    }

    enterSelectMode(){
        if(this.sourceID && this.map.sources.getById(this.sourceID)){
            this.map.sources.remove(this.sourceID);
        }
        if(this.layerID && this.map.layers.getLayerById(this.layerID)){
            this.map.layers.remove(this.layerID);
        }
        this.setState({select: true});
    }

    exitSelectMode(){
        this.removeSelectArea()
        this.setState({selectionTool: null, animations: {...this.state.animations, selectTools: {...this.state.animations.selectTools, in: false}}});
    }

    selectionDone(){
        this.selectionMade = true;
        this.selectionMadeRef.current.style.display = "block"; 
    }

    selectionRemoved(){
        this.selectionMade = false;
        this.selectionMadeRef.current.style.display = "none"; 
    }
    //---------------------

    //select toolbar button actions
    rectSelect(){
        this.removeSelectArea();
        if(this.state.selectionTool != SelectionTool.Rect){
            if(this.state.selectionTool != null){
                this.releaseCurrentHeldSelectionTool();
            }
            this.setState({selectionTool: SelectionTool.Rect})
        }else{
            this.setState({selectionTool: null})
        }
    }

    polygonSelect(){
        this.removeSelectArea();
        if(this.state.selectionTool != SelectionTool.Polygon){
            if(this.state.selectionTool != null){
                this.releaseCurrentHeldSelectionTool();
            }
            this.setState({selectionTool: SelectionTool.Polygon})
        }else{
            this.setState({selectionTool:null});
        }
    }

    releaseCurrentHeldSelectionTool(){
        let buttonInfo = this.selectionToolButtons[this.state.selectionTool-1];
        buttonInfo.change = !buttonInfo.change;
        this.setState();
    }
    //------------------

    stopEventPropagation(event){
        event.stopPropagation();
    }

    returnSelectLocationPoints(){
        return this.mapAreaSelectedPolygon.coordinates[0];
    }

    returnAreaPoints(){
        this.areaPoints = this.areaPoints.map((point)=>{
            return {x:point[0], y:point[1]}
        })
        return this.areaPoints;
    } 

    set setOnSelectExtraFunc(func){
        this.onSelectExtraFunc = func;
    }

    render(){
        return <div className="map" ref={this.mapRef}>
            <div className="mapToolBarHolder">
                <MapToolBar buttons={this.buttons} flexDirection="row"/>
            </div>
            {this.state.select?<div className="selectionWrapper" ref={this.selectionWrapperRef} draggable={false} onMouseDown={this.onMouseDown.bind(this)} onMouseMove={this.onMouseMove.bind(this)} onMouseUp={this.onMouseUp.bind(this)} onClick={this.onMouseClick.bind(this)}>
                <CSSTransition classNames="selectToolsAnimation" 
                                in={this.state.animations.selectTools.in} 
                                appear={true} enter={false}  exit={true}
                                timeout={this.state.animations.selectTools.time}
                                onExited={()=>{this.setState({select: false, animations: {...this.state.animations, selectTools: {...this.state.animations.selectTools, in: true}}});}}>
                    <div className="selectTools" onMouseUp={this.stopEventPropagation} onMouseDown={this.stopEventPropagation} onMouseMove={this.stopEventPropagation} onClick={this.stopEventPropagation}>
                        <MapToolBar buttons={this.selectionToolButtons} flexDirection="column"/>
                    </div>
                </CSSTransition>
                {this.state.selectionTool==SelectionTool.Rect?<div className="selectionArea" ref={this.selectionAreaRef}></div>:null}
                {this.state.selectionTool==SelectionTool.Polygon?<canvas ref={this.polygonSelectionRef} className="mainCanvas"></canvas>:null}
                {this.state.selectionTool==SelectionTool.Polygon?<canvas ref={this.polygonSelectionHelperRef} className="sideCanvas"></canvas>:null}
                <div className="selectAreaButton" onMouseDown={this.stopEventPropagation} onMouseUp={this.stopEventPropagation} onMouseMove={this.stopEventPropagation} ref={this.selectionMadeRef}>
                    <Button hold={false} iconSrc="/images/confirm.svg" style={{main:{background: "linear-gradient(to right, #983B89, #62086A)"}}} action={this.confirmSelect.bind(this)}/>
                </div>
            </div>:null
            }
        </div>
    }
}

export default Map;
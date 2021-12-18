import React, {useEffect, useState} from 'react';
import Button from './button.js'

function Tile(props){

    const [state, setState] = useState({
        edit: false,
        rhsBody: props.bodyrhs,
    })

    useEffect(()=>{
        setState({edit: state.edit, rhsBody: props.bodyrhs})
    }, [props])

    function windowOnLoad(event){
        window.addEventListener("load", function(e){
            let doc = event.target.contentDocument;
            let paths = doc.getElementsByTagName("path");
            for(let path of paths){
                path.style.fill = "lightgray";
            }
        })
    }

    function editButton(event){
        props.variable.value = state.rhsBody
        setState({edit: !state.edit, rhsBody: state.rhsBody})
    }

    function onChange(event){
        state.rhsBody = event.target.value
    }

    return (<div className="tile">
        {props.upperDivider?<div className="divider upperDivider"></div>:null}
        <div className="tileHeading">
            {props.heading}
        </div>
        <div className="tileBody">
            <div className="lhs">
                <div className="dot" style={{backgroundColor:props.iconColor}}></div>
                <object data={props.icon} width="25" height="25" style={{marginRight:"16px", marginLeft:"16px"}} onLoad={windowOnLoad}></object>
                <span>{props.bodylhs}</span>
            </div>
            <div className="rhs">
                {!state.edit?<span>{state.rhsBody}</span>:<input type="text" defaultValue={state.rhsBody} onChange={onChange}/>}
                {props.editable?<Button style={{main:{width:"30px", height:"30px", padding:"5px"}}} action={editButton} hold={false} change={false} iconSrc={!state.edit?"/images/edit.svg":"/images/confirm.svg"}/>:null}
            </div>
        </div>
        <div className="divider"></div>
    </div>);
}

export default Tile;
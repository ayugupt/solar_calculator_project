import React from 'react'
import Button from '../button.js'

class MapToolBar extends React.Component{
    constructor(props){
        super(props)
        this.props = props;
    }

    render(){
        return <div className="toolBar" style={{flexDirection: this.props.flexDirection}}>
            {
                this.props.buttons.map((button)=>{
                    return <Button key={button.id} style={button.style} action={button.action} hold={button.hold} iconSrc={button.iconSrc} change={button.change}/>
                })
            }
        </div>
    }
}

export default MapToolBar;
import React from 'react'
import tool from '../store/tool'
import "../styles/bar.scss"

const Settings = () => {
    return (
        <div className="settings bar">
            <label htmlFor="line-width">Толщина Линии</label>
            <input 
                onChange={(e) => tool.setLineWidth(e.target.value)}
                style={{margin: '0 10px'}} 
                defaultValue={1}
                type="number" 
                min={1} 
                max={20} 
                id="line-width" />
            
            <label htmlFor="stroke-color">Цвет обводки</label>
            <input 
                onChange={(e) => tool.setStrokeColor(e.target.value)}
                style={{margin: '0 10px'}} 
                type="color" 
                id="stroke-color" />

        </div>
    )
}

export default Settings
import React from 'react'
import canvas from '../store/canvas'
import tool from '../store/tool'
import "../styles/bar.scss"
import Brush from '../tools/Brush'
import Circle from '../tools/Circle'
import Eraser from '../tools/Eraser'
import Line from '../tools/Line'
import Square from '../tools/Square'

const Toolbar = () => {
    
    const changeColor = (e) => {
        tool.setStrokeColor(e.target.value)
        tool.setFillColor(e.target.value)
    }

    const download = (e) => {
        const dataUrl = canvas.canvas.toDataURL()
        const a = document.createElement('a')
        a.href = dataUrl
        a.download = canvas.sessionid + '.jpg'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
    }
    
    const setTool = (data) => {
        switch(data){
            case "Brush": tool.setTool(new Brush(canvas.canvas, canvas.socket, canvas.sessionid))
                break
            case "Square": tool.setTool(new Square(canvas.canvas, canvas.socket, canvas.sessionid))
                break
            case "Circle": tool.setTool(new Circle(canvas.canvas, canvas.socket, canvas.sessionid))
                break
            case "Eraser": tool.setTool(new Eraser(canvas.canvas, canvas.socket, canvas.sessionid))
                break
            case "Line": tool.setTool(new Line(canvas.canvas, canvas.socket, canvas.sessionid))
                break
            default: break
        }
    }

    return (
        <div className="toolbar bar">
            <button className='toolbar-btn brush' onClick={() => setTool('Brush')}>
                <img src="/img/brush.png" alt="" />
            </button>
            <button className='toolbar-btn rect' onClick={() => setTool('Square')}>
                <img src="/img/square.png" alt="" />
            </button>
            <button className='toolbar-btn circle' onClick={() => setTool('Circle')}>
                <img src="/img/circle.png" alt="" />
            </button>
            <button className='toolbar-btn eraser' onClick={() => setTool('Eraser')}>
                <img src="/img/eraser.png" alt="" />
            </button>
            <button className='toolbar-btn line' onClick={() => setTool('Line')}>
                <img src="/img/line.png" alt="" />
            </button>
            <input style={{marginLeft: 10}} type="color" value={tool.fillColor} onChange={(e) => changeColor(e)}/>
            <button className='toolbar-btn undo' onClick={() => canvas.undo()}>
                <img src="/img/undo.png" alt="" />
            </button>
            <button className='toolbar-btn redo' onClick={() => canvas.redo()}>
                <img src="/img/redo.png" alt="" />
            </button>
            <button className='toolbar-btn save' onClick={(e) => download(e)}>
                <img src="/img/save.png" alt="" />
            </button>
        </div>
    )
}

export default Toolbar
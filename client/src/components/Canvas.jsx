import React, { useEffect, useRef, useState } from 'react'
import "../styles/canvas.scss"
import {observer} from 'mobx-react-lite'
import canvas from '../store/canvas'
import tool from '../store/tool'
import Brush from '../tools/Brush'
import {useParams} from 'react-router-dom'
import Square from '../tools/Square'
import Circle from '../tools/Circle'
import Line from '../tools/Line'
import axios from 'axios'

const Canvas = observer(() => {
    const canvasRef = useRef()
    const usernameRef = useRef()
    const [modal, setModal] = useState(true)
    const params = useParams()

    const mousedownHandler = () => {
        canvas.pushToUndo(canvasRef.current.toDataURL())
        axios.post(`https://backpaintonlinewebsocket.herokuapp.com/image?id=${params.id}`, {img: canvasRef.current.toDataURL()})
            .then(response => console.log(response.data))
    }

    useEffect(() => {
        canvas.setCanvas(canvasRef.current)
        axios.get(`https://backpaintonlinewebsocket.herokuapp.com/image?id=${params.id}`)
            .then(response => {
                const img = new Image()
                img.src = response.data
                canvas.initCanvas(img)
            })
    }, [])

    useEffect(() => {
        if (canvas.username) {
            const socket = new WebSocket('wss://https://backpaintonlinewebsocket.herokuapp.com')
            canvas.setSocket(socket)
            canvas.setSessionid(params.id)
            tool.setTool(new Brush(canvasRef.current, socket, params.id))
            socket.onopen = () => {
                socket.send(JSON.stringify({
                    id: params.id,
                    username: canvas.username,
                    method: 'connection',
                    canvas: {
                        data: canvasRef.current.toDataURL()
                    }
                }))
            }
            socket.onmessage = (event) => {
                let msg = JSON.parse(event.data)
                switch(msg.method) {
                    case 'connection': connectionHandler(msg); break;
                    case 'draw': drawHandler(msg); break;
                    default: break;
                }
            }
        }
    }, [canvas.username])

    const connectHandler = () => {
        canvas.setUsername(usernameRef.current.value)
        setModal(false)
    }

    const connectionHandler = (msg) => {
        //
    }

    const drawHandler = (msg) => {
        const figure = msg.figure
        const ctx = canvasRef.current.getContext('2d')
        const activeFigureTypes = ['Brush', 'Square', 'Circle', 'Line', 'finish']
        if (activeFigureTypes.includes(figure.type)) {
            tool.setStrokeColor(msg.figureStyle.strokeColor)
            tool.setFillColor(msg.figureStyle.fillColor)
            tool.setLineWidth(msg.figureStyle.lineWidth)
        }
        switch(figure.type) {
            case 'Brush': Brush.wssDraw(ctx, figure.x, figure.y); break;
            case 'Square': Square.wssDraw(ctx, figure.x, figure.y, figure.width, figure.height); break;
            case 'Circle': Circle.wssDraw(ctx, figure.x, figure.y, figure.r); break;
            case 'Line': Line.wssDraw(ctx, figure.cx, figure.cy, figure.x, figure.y); break;
            case 'finish': ctx.beginPath(); break;
            default: break;
        }
    }

    return (
        <div className="canvas">
            <div className='modal' style={{display: modal ? 'block' : 'none'}}>
                <div className='modal-wrapper'>
                    <div className='modal-header'>
                        <h2>Укажите ваше прозвище</h2>
                    </div>
                    <div className='modal-body'>
                        <input ref={usernameRef} type="text" id='username' placeholder='К вам обращаться ?'/>
                    </div>
                    <div className='modal-footer'>
                        <button className='modal-btn modal-btn__accept' onClick={(e) => connectHandler()}>
                            Войти
                        </button>
                    </div>
                </div>
            </div>
            <canvas onMouseDown={() => mousedownHandler()} ref={canvasRef} width={1200} height={700}></canvas>
        </div>
    )
})

export default Canvas
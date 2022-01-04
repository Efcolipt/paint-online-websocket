import Tool from './Tool'

export default class Brush extends Tool {
    constructor(canvas, socket, sessionid) {
        super(canvas, socket, sessionid)
        this.listen()   
    }

    listen() {
        this.canvas.onmouseup = this.mouseupHandler.bind(this) 
        this.canvas.onmousedown = this.mousedownHandler.bind(this) 
        this.canvas.onmousemove = this.mousemoveHandler.bind(this) 
    }

    mouseupHandler(e) {
        this.mouseDown = false
        this.socketSend({
            type: 'finish',
        })
    }

    mousedownHandler(e) {
        this.mouseDown = true
        this.ctx.beginPath()
        this.ctx.moveTo(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop)
    }

    mousemoveHandler(e) {
        if (this.mouseDown) {
            this.socketSend({
                type: 'Brush',
                x: e.pageX - e.target.offsetLeft,
                y: e.pageY - e.target.offsetTop
            })
        }
    }

    static wssDraw(ctx, x, y) {
        ctx.lineTo(x, y)
        ctx.stroke()
    }

}
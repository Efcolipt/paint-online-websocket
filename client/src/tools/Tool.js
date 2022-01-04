export default class Tool {
    constructor(canvas, socket, sessionid) {
        this.canvas = canvas
        this.socket = socket
        this.sessionid = sessionid
        this.ctx = canvas.getContext('2d')
        this.destroy()
    }

    set fillColor(color) {
        this.ctx.fillStyle = color
    }

    get fillColor() {
        return this.ctx.fillStyle 
    }

    set strokeColor(color) {
        this.ctx.strokeStyle = color
    }

    get strokeColor() {
        return this.ctx.strokeStyle 
    }

    set lineWidth(width) {
        this.ctx.lineWidth = width
    }

    get lineWidth() {
        return this.ctx.lineWidth 
    }

    socketSend (figure) {
        this.socket.send(JSON.stringify({
            method: 'draw',
            id: this.sessionid,
            figureStyle: {
                lineWidth: this.lineWidth,
                strokeColor: this.strokeColor,
                fillColor: this.fillColor,
            },
            figure
        }))
    }

    destroy() {
        this.onmouseup = null
        this.onmousedown = null
        this.onmousemove = null
    }
}
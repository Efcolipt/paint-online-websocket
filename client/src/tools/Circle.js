import Tool from './Tool'

export default class Circle extends Tool {
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
        this.mousedown = false
        this.socketSend({
            type: 'Circle',
            x: this.startX,
            y: this.startY,
            r: this.radius
        })
    }

    mousedownHandler(e) {
        this.mousedown = true
        this.ctx.beginPath()
        this.startX = e.pageX - e.target.offsetLeft
        this.startY = e.pageY - e.target.offsetTop
        this.saved = this.canvas.toDataURL()
    }

    mousemoveHandler(e) {
        if (this.mousedown) {
            const currentX = e.pageX - e.target.offsetLeft
            const currentY = e.pageY - e.target.offsetTop
            const width = currentX - this.startX
            const height = currentY - this.startY 
            this.radius = Math.sqrt(width**2 + height**2)
            this.previewClient()
        }
    }

    previewClient() {
        const img = new Image()
        img.src = this.saved
        img.onload = async function () {
            this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height)
            this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
            this.ctx.beginPath()
            this.ctx.arc(this.startX, this.startY, this.radius, 0, 2*Math.PI)
            this.ctx.fill()
            this.ctx.stroke()
        }.bind(this)
    }

    static wssDraw(ctx, x, y, r) {
        ctx.beginPath()
        ctx.arc(x, y, r, 0, 2*Math.PI)
        ctx.fill()
        ctx.stroke()
    }

}
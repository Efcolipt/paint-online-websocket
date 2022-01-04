import Tool from './Tool'

export default class Square extends Tool {
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
            type: 'Square',
            x: this.startX,
            y: this.startY,
            width: this.width,
            height: this.height 
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
            let currentX = e.pageX - e.target.offsetLeft
            let currentY = e.pageY - e.target.offsetTop
            this.width = currentX - this.startX
            this.height = currentY - this.startY 
            this.previewClient()
        }
    }

    previewClient() {
        const img = new Image()
        img.src = this.saved
        img.onload = async function() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
            this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
            this.ctx.beginPath()
            this.ctx.rect(this.startX, this.startY, this.width, this.height)
            this.ctx.fill()
            this.ctx.stroke()
        }.bind(this)
    }

    static wssDraw(ctx, x, y, w, h) {
        ctx.beginPath()
        ctx.rect(x, y, w, h)
        ctx.fill()
        ctx.stroke()
    }

}
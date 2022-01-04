import Tool from "./Tool";


export default class Line extends Tool {
    constructor(canvas, socket, sessionid) {
        super(canvas, socket, sessionid)
        this.listen()   
    }

    listen() {
        this.canvas.onmousedown = this.mouseDownHandler.bind(this)
        this.canvas.onmouseup = this.mouseUpHandler.bind(this)
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this)
    }

    mouseDownHandler(e) {
        this.mouseDown = true
        this.currentX = e.pageX-e.target.offsetLeft
        this.currentY = e.pageY-e.target.offsetTop
        this.ctx.beginPath()
        this.ctx.moveTo(this.currentX, this.currentY )
        this.saved = this.canvas.toDataURL()
    }

    mouseUpHandler(e) {
        this.mouseDown = false
        this.socketSend({
            type: 'Line',
            cx: this.currentX,
            cy: this.currentY,
            x: this.x,
            y: this.y
        })
    }

    mouseMoveHandler(e) {
        if (this.mouseDown) {
            this.x = e.pageX-e.target.offsetLeft
            this.y = e.pageY-e.target.offsetTop
            this.previewClient();
        }
    }


    previewClient() {
        const img = new Image()
        img.src = this.saved
        img.onload = async function () {
            this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height)
            this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
            this.ctx.beginPath()
            this.ctx.moveTo(this.currentX, this.currentY)
            this.ctx.lineTo(this.x, this.y)
            this.ctx.stroke()
        }.bind(this)
    }

    static wssDraw(ctx, cx, cy, x, y) {
        ctx.beginPath()
        ctx.moveTo(cx, cy)
        ctx.lineTo(x, y)
        ctx.stroke()
    }
}
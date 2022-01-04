import Brush from "./Brush";

export default class Eraser extends Brush {
    constructor(canvas, socket, sessionid) {
        super(canvas, socket, sessionid)
        this.listen()   
    }

    static wssDraw(x, y) {
        this.strokeColor = "#fff"
        this.ctx.lineTo(x, y)
        this.ctx.stroke()
    }
}
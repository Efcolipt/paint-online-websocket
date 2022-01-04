import {makeAutoObservable} from 'mobx'
class Canvas {
    canvas = null
    undoList = []
    redoList = []
    username = ""
    sessionid = null
    socket = null

    constructor() {
        makeAutoObservable(this)
    }

    setCanvas (canvas) {
        this.canvas = canvas
    }

    setSessionid (id) {
        this.sessionid = id
    }

    setSocket (socket) {
        this.socket = socket
    }

    setUsername(name) {
        this.username = name
    }

    pushToRedo(data) {
        this.redoList.push(data)
    }

    pushToUndo(data) {
        this.undoList.push(data)
    }

    undo() {
        let ctx = this.canvas.getContext('2d')
        if (this.undoList.length > 0) {
            let dataUrl = this.undoList.pop()
            this.pushToRedo(this.canvas.toDataURL())
            let img = new Image()
            img.src = dataUrl
            this.initCanvas(img)
        } else {
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        }
    }

    initCanvas(img) {
        let ctx = this.canvas.getContext('2d')
        img.onload = async function () {
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
            ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
        }.bind(this)
    }

    redo() {
        if (this.redoList.length > 0) {
            let dataUrl = this.redoList.pop()
            this.pushToUndo(dataUrl)
            let img = new Image()
            img.src = dataUrl
            this.initCanvas(img)
        }
    }
}

export default new Canvas()
const express = require('express')
const app = express()
const wss = require('express-ws')(app)
const aWss = wss.getWss()
const PORT = process.env.PORT || 5000
const cors = require('cors')
const fs = require('fs')
const path = require('path')

app.use(cors())
app.use(express.json())

app.ws('/', (ws) => {
    ws.send('Подключился')
    ws.on('message', (msg) => {
        msg = JSON.parse(msg)
        switch(msg.method) {
            case 'connection': conntectionHandler(ws, msg); break;
            case 'draw': broadcastConnection(ws, msg); break;
        }
    })
})
app.listen(PORT, () => console.log(`Server listening port ${PORT}`)) 

app.post('/image', (req, res) => {
    try {
        const data = req.body.img.replace(`data:image/png;base64,`, '')
        fs.writeFileSync(path.resolve(__dirname, 'files', `${req.query.id}.jpg`), data, 'base64')
        return res.status(200).json({message: 'Загружено'})

    } catch (error) {
        return res.status(500).json(error)
    }
})

app.get('/image', (req, res) => {
    try {
        const file = fs.readFileSync(path.resolve(__dirname, 'files', `${req.query.id}.jpg`), data, 'base64')
        const data = `data:image/png;base64,` + file.toString('base64')
        return res.json(file)
    } catch (error) {
        return res.status(500).json(error)
    }
})

const conntectionHandler = (ws, msg) => {
    ws.id = msg.id
    broadcastConnection(ws, msg)
}

const broadcastConnection = (_, msg) => {
    aWss.clients.forEach(client => {
        if (client.id === msg.id) {
            client.send(JSON.stringify(msg))
        }
    })
}
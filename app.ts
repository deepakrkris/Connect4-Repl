import express from "express"
import bodyParser from "body-parser"
import path from 'path'
import { WebSocketServer } from 'ws'
import { init as db_init } from './models/db_connection.js';
import { GameServer, connection_listener } from './server/game_server.js'

const __dirname = path.resolve()
const app = express()
const server = app.listen(3000, () => {
    console.log("Application started and Listening on port 3000")
});

// server css as static
app.use(express.static(__dirname))

// get our app to use body parser 
app.use(bodyParser.urlencoded({ extended: true }))

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
})

app.get("/genGameCode", (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ code : GameServer.generateGameCode() }, null, 3));
})

db_init();

GameServer.socketServer = new WebSocketServer({ server })
GameServer.socketServer.on('connection', connection_listener);

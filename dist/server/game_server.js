import * as nanoid from 'nanoid';
import { isGameSessionMessage, isUserActionMessage } from "../models/types.js";
import { Game } from './game.js';
import { generateBoard } from './util.js';
import { MessageHandler } from './message_handler.js';
const CODE_RANGE = "#$@?{}0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz#$@?{}";
const code_generator = nanoid.customAlphabet(CODE_RANGE, 6);
export class GameServer {
    static createNewGame(message) {
        const game = new Game({
            gameCode: message.gameCode,
            status: 'registered',
            board: generateBoard()
        });
        return game;
    }
    static generateGameCode() {
        const code = code_generator();
        this.valid_game_codes.add(code);
        return code;
    }
    static getGameSession(message, ws) {
        if (!this.valid_game_codes.has(message.gameCode)) {
            MessageHandler.sendMessage(ws, {
                type: 'error',
                message: 'game code not registered'
            });
        }
        else {
            if (!GameServer.games.has(message.gameCode)) {
                const game = this.createNewGame(message);
                GameServer.games.set(message.gameCode, game);
            }
            return GameServer.games.get(message.gameCode);
        }
    }
    static establishUserGameSession(ws, message) {
        const game = this.getGameSession(message, ws);
        if (game)
            game.initGame(ws, message).catch(console.log);
    }
    static executeUserTurns(ws, message) {
        const game = this.getGameSession(message, ws);
        if (game)
            game.executeUserTurns(message).catch(console.log);
    }
    static getMessageListener(ws) {
        return (event) => {
            const message = JSON.parse(event.data);
            if (isGameSessionMessage(message)) {
                this.establishUserGameSession(ws, message);
            }
            else if (isUserActionMessage(message)) {
                this.executeUserTurns(ws, message);
            }
        };
    }
}
export function connection_listener(ws, req) {
    const connectionid = req.headers['sec-websocket-key'];
    ws.connectionid = connectionid;
    GameServer.connections.set(connectionid, ws);
    ws.addEventListener('message', GameServer.getMessageListener(ws));
    ws.addEventListener('close', (ev) => {
        if (GameServer.connection_to_game.has(connectionid)) {
            const gameCode = GameServer.connection_to_game.get(connectionid);
            const game = GameServer.games.get(gameCode);
            game.handleDisconnectedUser(connectionid);
            GameServer.connection_to_game.delete(connectionid);
        }
        GameServer.connections.delete(connectionid);
        console.log('Client has disconnected!');
    });
}
GameServer.connections = new Map();
GameServer.games = new Map;
GameServer.connection_to_game = new Map;
GameServer.valid_game_codes = new Set();

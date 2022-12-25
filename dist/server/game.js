var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { lastAvailableColumn } from './util.js';
import { sameRowMatch, sameColumnMatch, diagonalMatch } from './board_handlers.js';
import { EventEmitter } from 'events';
import { MessageHandler } from './message_handler.js';
import { GameServer } from './game_server.js';
import { createOrGetGameSession, saveGameMove, saveGameResult } from '../models/repository.js';
const user1_coin = 'RED_COIN';
const user2_coin = 'BLUE_COIN';
export class Game extends EventEmitter {
    constructor(game_state) {
        super();
        this.game_state = game_state;
        this.on('updatedGameBoard', MessageHandler.sendBoardUpdateMessages);
        this.on('game_init', MessageHandler.sendInitMessage);
        this.on('next_user_turn', MessageHandler.handleNextUserTurn);
        this.on('end_of_game', MessageHandler.endOfGameMessages);
        this.on('user_disconnected', MessageHandler.notifyDisconnectedUser);
    }
    initUser1(userId, connectionId) {
        const game_state = this.game_state;
        game_state.user1 = userId;
        game_state.user1_connection = connectionId;
        if (game_state.status === 'user1_disconnected') {
            this.emit('next_user_turn', this, game_state.user1_connection);
        }
        game_state.status = 'waiting_for_user2';
    }
    initUser2(userId, connectionId) {
        const game_state = this.game_state;
        game_state.user2 = userId;
        game_state.user2_connection = connectionId;
        if (game_state.status === 'user2_disconnected') {
            this.emit('next_user_turn', this, game_state.user2_connection);
        }
        game_state.status = 'start';
    }
    getUser1Connection(connections) {
        return connections.get(this.game_state.user1_connection);
    }
    getUser2Connection(connections) {
        return connections.get(this.game_state.user2_connection);
    }
    initGame(ws, message) {
        return __awaiter(this, void 0, void 0, function* () {
            const game_state = this.game_state;
            if (!game_state.user1) {
                this.initUser1(message.userId, ws.connectionid);
                GameServer.connection_to_game.set(ws.connectionid, game_state.gameCode);
                this.emit('game_init', ws, message.gameCode, message.userId, user1_coin);
            }
            else if (!game_state.user2) {
                this.initUser2(message.userId, ws.connectionid);
                GameServer.connection_to_game.set(ws.connectionid, game_state.gameCode);
                this.emit('game_init', ws, message.gameCode, message.userId, user2_coin);
                this.emit('next_user_turn', this, game_state.user1_connection);
                yield createOrGetGameSession(game_state);
            }
        });
    }
    handleDisconnectedUser(connectionId) {
        if (connectionId == this.game_state.user1_connection) {
            this.game_state.user1 = null;
            this.game_state.user1_connection = null;
            this.game_state.status = 'user1_disconnected';
            this.emit('user_disconnected', this.game_state.user2_connection);
        }
        if (connectionId == this.game_state.user2_connection) {
            this.game_state.user2 = null;
            this.game_state.user2_connection = null;
            this.game_state.status = 'user2_disconnected';
            this.emit('user_disconnected', this.game_state.user1_connection);
        }
    }
    updateGameBoard(message) {
        const game_state = this.game_state;
        const column_available = lastAvailableColumn(game_state.board[message.row], message.side);
        if (column_available > -1) {
            game_state.board[message.row][column_available] = message.coin;
            this.isUser1Turn = message.userId === game_state.user1;
            this.isUser2Turn = message.userId === game_state.user2;
            this.last_move_row = message.row;
            this.last_move_col = column_available;
            this.last_move_coin = message.coin;
            const notification = {
                gameCode: message.gameCode,
                row: message.row,
                col: column_available,
                coin: message.coin,
                side: message.side,
                userId: message.userId,
            };
            this.emit('updatedGameBoard', this, notification);
        }
    }
    executeUserTurns(message) {
        return __awaiter(this, void 0, void 0, function* () {
            this.updateGameBoard(message);
            yield saveGameMove(this.game_state);
            // console.log("handle user action for ", message)
            if (this.isWinningMove()) {
                this.game_state.winner = message.userId;
                this.emit('end_of_game', this);
                yield saveGameResult(this.game_state);
            }
            else {
                let next_user_connectionId = null;
                if (this.isUser1Turn) {
                    next_user_connectionId = this.game_state.user2_connection;
                }
                else {
                    next_user_connectionId = this.game_state.user1_connection;
                }
                this.emit('next_user_turn', this, next_user_connectionId);
            }
        });
    }
    isWinningMove() {
        if (sameRowMatch(this.game_state, this.last_move_row, this.last_move_col, this.last_move_coin)
            || sameColumnMatch(this.game_state, this.last_move_row, this.last_move_col, this.last_move_coin)
            || diagonalMatch(this.game_state, this.last_move_row, this.last_move_col, this.last_move_coin)) {
            return true;
        }
        return false;
    }
}

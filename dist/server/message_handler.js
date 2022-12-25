import { GameServer } from "./game_server.js";
const winning_message = 'You Won !!!';
const next_try_message = 'The other player won :) , Ask for a re-match !! ';
export class MessageHandler {
    static endOfGameMessages(game) {
        const connections = GameServer.connections;
        let winner;
        let runner;
        if (game.isUser1Turn) {
            console.log('user 1 is winner');
            winner = game.getUser1Connection(connections);
            runner = game.getUser2Connection(connections);
        }
        else {
            console.log('user 2 is winner');
            winner = game.getUser1Connection(connections);
            runner = game.getUser2Connection(connections);
        }
        winner.send(JSON.stringify({
            type: 'result',
            message: winning_message,
        }));
        runner.send(JSON.stringify({
            type: 'result',
            message: next_try_message
        }));
    }
    static sendMessage(ws, message) {
        ws.send(JSON.stringify(message));
    }
    static sendInitMessage(ws, gameCode, userId, coin) {
        const notification = {
            gameCode,
            userId,
            type: 'session',
            coin,
        };
        ws.send(JSON.stringify(notification));
    }
    static sendBoardUpdateMessages(game, userNotification) {
        const connections = GameServer.connections;
        game.getUser1Connection(connections).send(JSON.stringify(userNotification));
        game.getUser2Connection(connections).send(JSON.stringify(userNotification));
    }
    static handleNextUserTurn(game, next_user_connectionId) {
        const connections = GameServer.connections;
        const start_your_turn = {
            'type': 'take_turn',
            message: 'Your turn now !'
        };
        connections.get(next_user_connectionId).send(JSON.stringify(start_your_turn));
    }
    static notifyDisconnectedUser(peer_connection_id) {
        const connections = GameServer.connections;
        const start_your_turn = {
            'type': 'peer_disconnected',
            message: 'Peer disconnected, Wait until they rejoin!'
        };
        //connections.get(peer_connection_id).send(JSON.stringify(start_your_turn))
    }
}

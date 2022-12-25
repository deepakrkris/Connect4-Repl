var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Game } from '../models/index.js';
import { getQueryRunner } from "./db_connection.js";
const user1_coin = 'RED_COIN';
const user2_coin = 'BLUE_COIN';
export function to_gameState(game) {
    return {
        user1: game.user1,
        user2: game.user2,
        gameCode: game.id,
        board: JSON.parse(game.data),
        status: game.status,
    };
}
export function createOrGetGameSession(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const queryRunner = getQueryRunner();
        yield queryRunner.connect();
        const games = yield queryRunner.query((`select * from game where id = \'${data.gameCode}\'`));
        if (games && games.length) {
            return this.to_gameState(games[0]);
        }
        const new_game = new Game();
        new_game.user1 = data.user1;
        new_game.user2 = data.user2;
        new_game.status = 'ready';
        new_game.user1_coin = user1_coin,
            new_game.user2_coin = user2_coin,
            new_game.id = data.gameCode;
        new_game.data = JSON.stringify(data.board);
        yield new_game.save();
        return {
            gameCode: new_game.id,
            user1: new_game.user1,
            user2: new_game.user2,
            board: JSON.parse(new_game.data),
            status: new_game.status,
        };
    });
}
export function saveGameMove(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const new_game = new Game();
        new_game.id = data.gameCode;
        new_game.data = JSON.stringify(data.board);
        yield new_game.save();
    });
}
export function saveGameResult(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const new_game = new Game();
        new_game.id = data.gameCode;
        new_game.status = 'completed';
        new_game.winner = data.winner;
        yield new_game.save();
    });
}

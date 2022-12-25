import { Game } from '../models/index.js';
import { getQueryRunner } from "./db_connection.js";
import { GameState } from './types.js';

const user1_coin = 'RED_COIN'
const user2_coin = 'BLUE_COIN'

export function to_gameState(game : Game) : GameState {
    return {
        user1 : game.user1,
        user2 : game.user2,
        gameCode : game.id,
        board: JSON.parse(game.data),
        status : game.status,
    }
}

export async function createOrGetGameSession(data : GameState) : Promise<GameState> {
    const queryRunner = getQueryRunner();
    await queryRunner.connect();

    const games : Game[] = await queryRunner.query((`select * from game where id = \'${data.gameCode}\'`));

    if (games && games.length) {
        return this.to_gameState(games[0])
    }

    const new_game : Game = new Game();
    new_game.user1 = data.user1;
    new_game.user2 = data.user2;
    new_game.status = 'ready';
    new_game.user1_coin = user1_coin,
    new_game.user2_coin = user2_coin,
    new_game.id = data.gameCode;
    new_game.data = JSON.stringify(data.board);
    await new_game.save();

    return {
        gameCode : new_game.id,
        user1 : new_game.user1,
        user2 : new_game.user2,
        board: JSON.parse(new_game.data),
        status: new_game.status,
    };
}

export async function saveGameMove(data : GameState) : Promise<void> {
    const new_game : Game = new Game();
    new_game.id = data.gameCode;
    new_game.data = JSON.stringify(data.board);
    await new_game.save();
}

export async function saveGameResult(data : GameState) : Promise<void> {
    const new_game : Game = new Game();
    new_game.id = data.gameCode;
    new_game.status = 'completed';
    new_game.winner = data.winner;
    await new_game.save();
}

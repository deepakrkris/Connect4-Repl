import { Game , User } from '../models/index.js';
import { getQueryRunner, getQueryBuilder } from "./db_connection.js";
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

export async function findUser(userId : string) : Promise<User> {
    const users : User[] = await User.find({
        where: { userId }
    })

    if (!users.length)
       return null

    return users[0]
}

export async function findGame(gameCode : string) {
    const queryRunner = getQueryRunner()
    await queryRunner.connect()

    const games : Game[] = await queryRunner.manager.find(Game, {
        where : [{
            id : gameCode,
        }],
    })

    await queryRunner.release()

    if (!games.length)
        return null
    
    return games[0]
}

export async function saveGame(data : GameState) : Promise<Game> {
    const new_game : Game = new Game()
    new_game.user1 = data.user1;
    new_game.user2 = data.user2;
    new_game.status = 'ready';
    new_game.user1_coin = user1_coin,
    new_game.user2_coin = user2_coin,
    new_game.id = data.gameCode;
    new_game.data = JSON.stringify(data.board)
    return new_game.save()
}

export async function createOrGetUser(userId : string) : Promise<User> {
    const user = await findUser(userId)

    if (user) {
        return user
    }

    const new_user : User = new User()
    new_user.userId = userId
    new_user.number_of_games = 0
    new_user.wins = 0
    return new_user.save()
}

export async function createOrGetGameSession(data : GameState) : Promise<GameState> {
    const game = await findGame(data.gameCode)

    if (game) {
        to_gameState(game)
    }

    const new_game : Game = await saveGame(data)

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

export async function incrementUserGames(userId : string) : Promise<void> {
    const queryBuilder = getQueryBuilder<User>();
    await queryBuilder
        .update(User)
        .set({ number_of_games: () => "number_of_games + 1" })
        .where("userId = :userId",  { userId })
        .execute()
}

export async function incrementUserWins(userId : string) : Promise<void> {
    const queryBuilder = getQueryBuilder<User>();
    await queryBuilder
        .update(User)
        .set({ wins: () => "wins + 1" })
        .where("userId = :userId",  { userId })
        .execute()
}

export async function saveGameResult(data : GameState) : Promise<void> {
    const new_game : Game = new Game()
    new_game.id = data.gameCode;
    new_game.status = 'completed'
    new_game.winner = data.winner
    await new_game.save()
    await incrementUserGames(data.user1)
    await incrementUserGames(data.user2)
    await incrementUserWins(data.winner)
}

export interface GameState {
    gameCode : string,
    user1? : string,
    user2? : string,
    status: string,
    board : string[][],
    user1_connection? : string,
    user2_connection? : string,
    winner? : string,
}

export interface ExtendedWebSocket extends WebSocket {
    connectionid : string,
}

export interface ClientState {
    gameCode? : string,
    userId? : string,
    coin? : string,
}

export interface UserActionMessage {
    gameCode : string,
    row : number,
    col? : number,
    side : string,
    coin : string,
    userId : string,
}

export interface GameSessionMessage {
    type : 'session',
    userId : string,
    gameCode : string,
    coin? : string,
}

export interface NotificationMessage {
    type : string,
    message : string,
}

export function isGameSessionMessage(obj: any): obj is GameSessionMessage {
    return 'type' in obj && obj.type == 'session' && 'userId' in obj && 'gameCode' in obj
}

export function isUserActionMessage(obj: any): obj is UserActionMessage {
    return 'row' in obj && 'coin' in obj
}

export function isNotificationMessage(obj: any): obj is NotificationMessage {
    return 'type' in obj && 'message' in obj
}

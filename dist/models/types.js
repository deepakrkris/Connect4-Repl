export function isGameSessionMessage(obj) {
    return 'type' in obj && obj.type == 'session' && 'userId' in obj && 'gameCode' in obj;
}
export function isUserActionMessage(obj) {
    return 'row' in obj && 'coin' in obj;
}
export function isNotificationMessage(obj) {
    return 'type' in obj && 'message' in obj;
}

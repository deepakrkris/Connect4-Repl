"use strict";
exports.__esModule = true;
exports.isNotificationMessage = exports.isUserActionMessage = exports.isGameSessionMessage = void 0;
function isGameSessionMessage(obj) {
    return 'type' in obj && obj.type == 'session' && 'userId' in obj && 'gameCode' in obj;
}
exports.isGameSessionMessage = isGameSessionMessage;
function isUserActionMessage(obj) {
    return 'row' in obj && 'coin' in obj;
}
exports.isUserActionMessage = isUserActionMessage;
function isNotificationMessage(obj) {
    return 'type' in obj && 'message' in obj;
}
exports.isNotificationMessage = isNotificationMessage;

import { isGameSessionMessage, isUserActionMessage, isNotificationMessage } from '../models/types.js';
import { handleGameNotification, handleGameSessionNotification, handleUserActionNotification } from './ui_handlers.js';
export class ClientConnection {
    static init() {
        this.client_state = {};
    }
    static send(message) {
        this.websocket.send(JSON.stringify(message));
    }
}
ClientConnection.client_state = {};
ClientConnection.websocket = new WebSocket(location.origin.replace(/^http/, 'ws'));
ClientConnection.websocket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    // console.log(data)
    if (isUserActionMessage(data)) {
        handleUserActionNotification(data);
    }
    else if (isGameSessionMessage(data)) {
        handleGameSessionNotification(data);
    }
    else if (isNotificationMessage(data)) {
        handleGameNotification(data);
    }
};

import 'https://code.jquery.com/jquery-3.6.0.min.js'
import { UserActionMessage, GameSessionMessage, NotificationMessage } from '../models/types.js'
import { ClientConnection } from './client_state.js'

const join_btn = document.getElementById('join_btn');
const message_window = document.getElementById('description');
const mandatury_fields = ['userId', 'gameCode'];

join_btn.addEventListener('click', function(event: MouseEvent) {
    const userId_e = document.getElementById('userId') as HTMLInputElement | null
    const gameCode_e = document.getElementById('gameCode') as HTMLInputElement | null
    const client_state = ClientConnection.client_state
    client_state.userId = userId_e.value
    client_state.gameCode = gameCode_e.value

    const join_game : GameSessionMessage = {
        userId : client_state.userId,
        gameCode : client_state.gameCode,
        type : 'session',
    }
    ClientConnection.send(join_game)
})
join_btn.setAttribute('disabled', 'true');

mandatury_fields.forEach((field_name) => {
    const field = document.getElementById(field_name);
    field.addEventListener('keyup', function(event) {
        const all_fields_entered = mandatury_fields.every((f) => {
            const element = document.getElementById(f) as HTMLInputElement | null;
            const flag = element.value != '' && element.value.length >= parseInt(element.getAttribute('minlength'));
            return flag;
        });
        if (all_fields_entered) {
            join_btn.removeAttribute('disabled');
        }
    });
});

function handleUserClickAction(target : HTMLElement) {
    const row_clicked : number = parseInt(target.attributes.getNamedItem('row').value)
    const side : string = target.attributes.getNamedItem('side').value
    const client_state = ClientConnection.client_state

    const message : UserActionMessage = {
        row: row_clicked,
        coin: client_state.coin,
        gameCode: client_state.gameCode,
        side,
        userId: client_state.userId,
    }
    ClientConnection.send(message)
}

export function leftGridListener({ target }) {
    if (target.className == 'click_position') {
        handleUserClickAction(target)
        $('#left-side-container').off('click')
        $('#right-side-container').off('click')
        message_window.innerHTML = "Wait! Other player's turn now";
    }
}

export function rightGridListener({ target }) {
    if (target.className == 'click_position') {
        handleUserClickAction(target)
        $('#left-side-container').off('click')
        $('#right-side-container').off('click')
        message_window.innerHTML = "Wait! Other player's turn now";
    }
}

export function handleUserActionNotification(data : UserActionMessage) {
    const row_clicked = data.row
    const col_available = data.col

    $('div[id=empty_position]').each((_, empty_position) => {
        const row = parseInt(empty_position.attributes.getNamedItem("row").value)
        const col = parseInt(empty_position.attributes.getNamedItem("col").value)
        if ( row === row_clicked && col === col_available ) {
            empty_position.setAttribute('class', data.coin);
        }
    })
}

export function handleGameSessionNotification(data : GameSessionMessage) {
    const client_state = ClientConnection.client_state
    client_state.coin = data.coin
    join_btn.setAttribute('disabled', 'true');
    $('.bodyTable').show();
    $('#left-side-container').off('click')
    $('#right-side-container').off('click')
}

export function handleGameNotification(data : NotificationMessage) {
    if (data.type === 'take_turn') {
        $('#left-side-container').off('click')
        $('#right-side-container').off('click')
        $('#left-side-container').on('click', ClientConnection.leftGridListener)
        $('#right-side-container').on('click', ClientConnection.rightGridListener)
        message_window.innerHTML = data.message
    } else if (data.type === 'result') {
        message_window.innerHTML = data.message
    } else if (data.type === 'peer_disconnected') {
        console.log('peer disconnect')
        $('#left-side-container').off('click')
        $('#right-side-container').off('click')
        message_window.innerHTML = data.message
    }
}

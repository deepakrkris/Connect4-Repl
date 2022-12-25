import 'https://code.jquery.com/jquery-3.6.0.min.js'
import { generateGrid } from './util.js';
import { ClientConnection } from './client_state.js';
import { leftGridListener, rightGridListener } from './ui_handlers.js'

generateGrid()

ClientConnection.init()
ClientConnection.leftGridListener = leftGridListener
ClientConnection.rightGridListener = rightGridListener

$('#left-side-container').on('click', ClientConnection.leftGridListener)
$('#right-side-container').on('click', ClientConnection.rightGridListener)
$('.bodyTable').css('display','none');

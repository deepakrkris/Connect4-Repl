export function generateBoard() {
    const board : string[][] = []
    for (let row=0; row<7; ++row) {
        const row = []
        for (let col=0; col<7; ++col) {
            row.push('')
        }
        board.push(row)
    }
    return board
}

export function lastAvailableColumn(row : string[], side : string) {
    if (side == 'L') {
        for (let i=0; i<7; ++i) {
            if (row[i] == '')
               return i
        }
    } else {
        for (let i=6; i > -1; --i) {
            if (row[i] == '')
               return i
        }
    }
    return -1
}

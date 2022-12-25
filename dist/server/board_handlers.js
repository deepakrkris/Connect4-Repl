export function sameColumnMatch(game, row, col, coin) {
    const match_candidates = game.board.map((row) => row[col]);
    let continuous_match = 0;
    for (let c = 0; c < 7; ++c) {
        if (match_candidates[c] === coin)
            continuous_match += 1;
        else
            continuous_match = 0;
        if (continuous_match >= 4)
            return true;
    }
    return continuous_match >= 4;
}
export function sameRowMatch(game, row, col, coin) {
    const match_candidates = game.board[row];
    let continuous_match = 0;
    for (let c = 0; c < match_candidates.length; ++c) {
        if (match_candidates[c] === coin)
            continuous_match += 1;
        else
            continuous_match = 0;
        if (continuous_match >= 4)
            return true;
    }
    return continuous_match >= 4;
}
export function get_matchfn_for_change_vectors(board, row, col, coin) {
    return function match(change_vector) {
        let continuous_match = 0;
        for (let v of change_vector) {
            let row_index = row;
            let col_index = col;
            let row_incr = v[0];
            let col_incr = v[1];
            // move from current placement cell 
            row_index += row_incr;
            col_index += col_incr;
            while (row_index >= 0 && col_index >= 0 && row_index < 7 && col_index < 7) {
                if (board[row_index][col_index] === coin)
                    continuous_match += 1;
                else
                    continuous_match = 0;
                // if 3 match found in down and up directions of one of diagonals / or \ ,
                // then with current placement 3 + 1 gives 4 matches
                if (continuous_match >= 3)
                    return true;
                row_index += row_incr;
                col_index += col_incr;
            }
        }
        return continuous_match >= 3;
    };
}
export function diagonalMatch(game, row, col, coin) {
    const match_candidates = game.board;
    const matchFn = get_matchfn_for_change_vectors(match_candidates, row, col, coin);
    const change_vector = [[1, -1], [-1, 1]];
    const reverse_change_vector = [[1, 1], [-1, -1]];
    if (matchFn(change_vector))
        return true;
    if (matchFn(reverse_change_vector))
        return true;
    return false;
}
/*
Test : node --loader ts-node/esm ./board_handlers.ts
const board : string[][] = [
//   0     1     2     3   4     5      6
    ['',   'R' , ' ', ' ', ' ' , '',   ''],  //0
    ['',   ' ' , 'R', ' ', ' ' , 'R',  ''],  //1
    ['',   ' ' , 'R', 'R', ' ' , '',   ''],  //2
    ['',   'R' , 'R', 'R', 'R' , '',   ''],  //3
    ['',   ' ' , 'R', ' ', ' ' , '',   ''],  //4
    ['',   ' ' , ' ', ' ', ' ' , '',   ''],  //5
    ['R',   ' ' , ' ', 'R', 'R' , 'R', 'R']  //6
]

const game = {
    gameCode: '1',
    status: 'new',
    board,
}

console.log(sameColumnMatch(game, 3, 2, 'R'))
console.log(sameRowMatch(game, 6, 3, 'R'))
console.log(diagonalMatch(game, 3, 4, 'R'))
*/ 

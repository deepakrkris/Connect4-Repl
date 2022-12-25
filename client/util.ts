export function generateRows(row) {
    let row_innerhtml = ""

    for (let col = 0; col < 7; ++col) {
        let html_content = "<div class=\"letter\" ><div class=\"empty_position\" id=\"empty_position\" "
        html_content +=  ` row="${row}" col="${col}"></div></div>`
        row_innerhtml += html_content
    }
    return row_innerhtml
}

export function generateGrid() {
    for (let row = 0; row < 7; ++row) {
        document.querySelector(
            `[coin-row-id='${row}']` ).innerHTML = generateRows(row)
    }    
}

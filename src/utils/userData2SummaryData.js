import { evaluate as mathEval }  from "mathjs";

const alphabetList = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];

const isOperator = term => {
    return term === '+' || term === '-' || term === '*' || term === '/'
}

const isEvaluatable = (exp, userData, summary) => {
    const terms = exp.split(' ')
    for (const [index, term] of terms.entries()) {
        // if (term.startsWith('sum')) {
        //     const reg = /\(([^)]*)\)/;
        //     const selected = exp.match(reg)[1]
        //     const startCell = selected.split(':')[0]
        //     const endCell = selected.split(':')[1]
        //     const startRow = startCell.split('_')[1]
        //     const startCol = startCell.split('_')[2]
        //     const endRow = endCell.split('_')[1]
        //     const endCol = endCell.split('_')[2]

        //     //console.log(term)
        //     //data from user
        //     if (startCell.startsWith('#a1'))
        //         continue
        //     //data in summary table

        //     //vertical
        //     if (startRow === endRow) {
        //         const startC = Number(startCol.substring(1))
        //         const endC = Number(endCol.substring(1))
        //         for (var c = startC; c < endC; ++c) {
        //             if (summary[`#b1_${startRow}_c${c}`] === undefined)
        //                 return false
        //         }
        //     }
        //     //horizontal
        //     if (startCol === endCol) {
        //         const startR = Number(startRow.substring(1))
        //         const endR = Number(endRow.substring(1))
        //         for (var r = startR; r < endR; ++r) {
        //             if (summary[`#b1_r${r}_${startCol}`] === undefined)
        //                 return false
        //         }
        //     }
        //     continue
        // }
        if (isOperator(term))
            continue
        //normal number
        if (!term.startsWith('#'))
            continue
        //summation term
        //data from user
        if (term.startsWith('#a1'))
            continue
        //data from summary
        if (summary[term] !== undefined)
            continue
        if (summary[term] === undefined)
            return false
    }
    return true
}

const evalSummation = (exp, userData, summary) => {
    const reg = /\(([^)]*)\)/;
    const selected = exp.match(reg)[1]
    const startCell = selected.split(':')[0]
    const endCell = selected.split(':')[1]
    const startRow = startCell.split('_')[1].substring(1)
    const startCol = startCell.split('_')[1].substring(0, 1)
    const endRow = endCell.split('_')[1].substring(1)
    const endCol = endCell.split('_')[1].substring(0, 1)

    const form = startCell.split('_')[0].substring(0, 2)
    const table = startCell.split('_')[0].substring(2)

    //data from user
    if(form.includes('#a')) {
        //horizontal
        if (startRow === endRow) {
            var sum = 0;
            const startC = alphabetList.indexOf(startCol)
            const endC = alphabetList.indexOf(endCol)
            for (var c = startC; c <= endC; ++c) {
                sum += Number(userData[`#a${table}_${alphabetList[c]}${startRow}`])
            }
            return sum
        }
        //vertical
        if (startCol === endCol) {
            var sum = 0
            console.log(userData)
            for (var r = startRow; r <= endRow; ++r) {
                sum += Number(userData[`#a${table}_${startCol}${r}`])
            }
            return sum
        }
    }
    //data from summary
    if(table === '#b') {
        //horizontal
        if (startRow === endRow) {
            var sum = 0;
            const startC = alphabetList.indexOf(startCol)
            const endC = alphabetList.indexOf(endCol)
            for (var c = startC; c <= endC; ++c) {
                sum += Number(summary[`#b${table}_${alphabetList[c]}${startRow}`])
            }
            return sum
        }
        //vertical
        if (startCol === endCol) {
            var sum = 0
            for (var r = startRow; r <= endRow; ++r) {
                sum += Number(summary[`#b${table}_${startCol}${r}`])
            }
            return sum
        }
    }
}

const evaluate = (exp, userData, summary) => {
    const terms = exp.split(' ')
    for (const [index, term] of terms.entries()) {
        if(term.startsWith('sum')) {
            terms[index] = evalSummation(term, userData, summary)
            continue
        }
        if (isOperator(term))
            continue
        if (term.startsWith('#a')) {
            terms[index] = userData[term]
            continue
        }
        if (term.startsWith('#b')) {
            terms[index] = summary[term]
            continue
        }
    }
    //console.log(mathEval(terms.join('')))
    try {
        return mathEval(terms.join(''))
    }
    catch(e) {
        return terms.join('')
    }
}

const createSummaryData = (formTemplate, userData) => {
    const summary = {}
    const queue = []
    for(const table of formTemplate) {
        for (const row of table.rows) {
            for (const cell of row.columns) {
                if (cell.type === 'formula' && isEvaluatable(cell.value.substring(1), userData, summary)) {
                    //console.log(cell.value)
                    summary[cell.key] = evaluate(cell.value.substring(1), userData, summary)
                }
                else if (cell.type === 'formula') {
                    queue.push(cell)
                }
            }
        }
    }
    if (queue.length > 0) {
        for (const cell of queue) {
            summary[cell.key] = evaluate(cell.value.substring(1), userData, summary)
        }
    }
    return summary
}

const userData2SummaryData = (formTemplate, userData) => {
    return createSummaryData(formTemplate, userData)
}

export default userData2SummaryData
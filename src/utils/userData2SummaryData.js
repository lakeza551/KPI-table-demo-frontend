import { isNumber, evaluate as mathEval }  from "mathjs";

const alphabetList = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];

const isOperator = term => {
    return term === '+' || term === '-' || term === '*' || term === '/'
}

const isEvaluatable = (exp, userData, summary) => {
    const terms = exp.split(' ')
    for (const [index, term] of terms.entries()) {
        if (isOperator(term))
            continue
        //normal number
        if (!term.startsWith('#'))
            continue
        //summation term
        //data from user
        if (term.startsWith('#a'))
            continue
        //data from summary
        if (summary[term] !== undefined)
            continue
        if (summary[term] === undefined)
            return false
    }
    return true
}

const evalHasValue = (exp, userData, summary) => {
    const reg = /\(([^)]*)\)/;
    const selected = exp.match(reg)[1]
    const startCell = selected.split(':')[0]
    const endCell = selected.split(':')[1]
    const startRow = Number(startCell.split('_')[1].substring(1))
    const startCol = startCell.split('_')[1].substring(0, 1)
    const endRow = Number(endCell.split('_')[1].substring(1))
    const endCol = endCell.split('_')[1].substring(0, 1)

    const form = startCell.split('_')[0].substring(0, 2)
    const table = startCell.split('_')[0].substring(2)

    //data from user
    if(form.includes('#a')) {
        //horizontal
        if (startRow === endRow) {
            const startC = alphabetList.indexOf(startCol)
            const endC = alphabetList.indexOf(endCol)
            for (var c = startC; c <= endC; ++c) {
                const val = userData[`#a${table}_${alphabetList[c]}${startRow}`]
                if(val === '' || val === null || val === undefined)
                    continue
                return 1
            }
            return 0
        }
        //vertical
        if (startCol === endCol) {
            for (var r = startRow; r <= endRow; ++r) {
                const val = userData[`#a${table}_${startCol}${r}`]
                if(val === '' || val === null || val === undefined)
                    continue
                return 1
            }
            return 0
        }
    }
    //data from summary
    if(form.includes('#b')) {
        //horizontal
        if (startRow === endRow) {
            var sum = 0;
            const startC = alphabetList.indexOf(startCol)
            const endC = alphabetList.indexOf(endCol)
            for (var c = startC; c <= endC; ++c) {
                const val = summary[`#b${table}_${alphabetList[c]}${startRow}`]
                if(val === '' || val === null || val === undefined)
                    continue
                sum += 1
            }
            return sum
        }
        //vertical
        if (startCol === endCol) {
            var sum = 0
            //console.log(summary)
            for (var r = startRow; r <= endRow; ++r) {
                const val = summary[`#b${table}_${startCol}${r}`]
                //console.log(val)
                if(val === '' || val === null || val === undefined)
                    continue
                sum += 1
            }
            return sum
        }
    }
}

const evalCount = (exp, userData, summary) => {
    const reg = /\(([^)]*)\)/;
    const selected = exp.match(reg)[1]
    const startCell = selected.split(':')[0]
    const endCell = selected.split(':')[1]
    const startRow = Number(startCell.split('_')[1].substring(1))
    const startCol = startCell.split('_')[1].substring(0, 1)
    const endRow = Number(endCell.split('_')[1].substring(1))
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
                const val = userData[`#a${table}_${alphabetList[c]}${startRow}`]
                if(val === '' || val === null || val === undefined)
                    continue
                sum += 1
            }
            return sum
        }
        //vertical
        if (startCol === endCol) {
            var sum = 0
            for (var r = startRow; r <= endRow; ++r) {
                const val = userData[`#a${table}_${startCol}${r}`]
                if(val === '' || val === null || val === undefined)
                    continue
                sum += 1
            }
            return sum
        }
    }
    //data from summary
    if(form.includes('#b')) {
        //horizontal
        if (startRow === endRow) {
            var sum = 0;
            const startC = alphabetList.indexOf(startCol)
            const endC = alphabetList.indexOf(endCol)
            for (var c = startC; c <= endC; ++c) {
                const val = summary[`#b${table}_${alphabetList[c]}${startRow}`]
                if(val === '' || val === null || val === undefined)
                    continue
                sum += 1
            }
            return sum
        }
        //vertical
        if (startCol === endCol) {
            var sum = 0
            //console.log(summary)
            for (var r = startRow; r <= endRow; ++r) {
                const val = summary[`#b${table}_${startCol}${r}`]
                //console.log(val)
                if(val === '' || val === null || val === undefined)
                    continue
                sum += 1
            }
            return sum
        }
    }
}

const evalSummation = (exp, userData, summary) => {
    const reg = /\(([^)]*)\)/;
    const selected = exp.match(reg)[1]
    const startCell = selected.split(':')[0]
    const endCell = selected.split(':')[1]
    const startRow = Number(startCell.split('_')[1].substring(1))
    const startCol = startCell.split('_')[1].substring(0, 1)
    const endRow = Number(endCell.split('_')[1].substring(1))
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
                const val = userData[`#a${table}_${alphabetList[c]}${startRow}`]
                if(val === '' || val === null || val === undefined || isNaN(Number(val)))
                    continue
                sum += Number(val)
            }
            return sum
        }
        //vertical
        if (startCol === endCol) {
            var sum = 0
            for (var r = startRow; r <= endRow; ++r) {
                const val = userData[`#a${table}_${startCol}${r}`]
                if(val === '' || val === null || val === undefined || isNaN(Number(val)))
                    continue
                sum += Number(val)
            }
            return sum
        }
    }
    //data from summary
    if(form.includes('#b')) {
        //horizontal
        if (startRow === endRow) {
            var sum = 0;
            const startC = alphabetList.indexOf(startCol)
            const endC = alphabetList.indexOf(endCol)
            for (var c = startC; c <= endC; ++c) {
                const val = summary[`#b${table}_${alphabetList[c]}${startRow}`]
                if(val === '' || val === null || val === undefined || isNaN(Number(val)))
                    continue
                sum += Number(summary[`#b${table}_${alphabetList[c]}${startRow}`])
            }
            return sum
        }
        //vertical
        if (startCol === endCol) {
            var sum = 0
            //console.log(summary)
            for (var r = startRow; r <= endRow; ++r) {
                const val = summary[`#b${table}_${startCol}${r}`]
                //console.log(val)
                if(val === '' || val === null || val === undefined || isNaN(Number(val)))
                    continue
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
        if(term.startsWith('count')) {
            terms[index] = evalCount(term, userData, summary)
        }
        if(term.startsWith('hasValue')) {
            terms[index] = evalHasValue(term, userData, summary)
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
    if(terms.length === 1)
        return terms[0]
    try {
        const val = mathEval(terms.join(''))
        return Number.isInteger(val) ? val : val.toFixed(2)
    }
    catch(e) {
        return ''
    }
}

const createSummaryData = (formTemplate, userData) => {
    const summary = {}
    const queue = []
    //console.log(userData)
    for(const table of formTemplate) {
        for (const row of table.rows) {
            for (const cell of row.columns) {
                if(userData === null)
                    summary[cell.key] = 0
                else if (cell.type === 'formula' && isEvaluatable(cell.value.substring(1), userData, summary)) {
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
    //console.log(summary)
    return summary
}

const userData2SummaryData = (formTemplate, userData) => {
    return createSummaryData(formTemplate, userData)
}

export default userData2SummaryData
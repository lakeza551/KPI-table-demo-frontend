import { evaluate as mathEval, sum } from 'mathjs'
import { useState, useEffect } from "react"

function ViewSummaryForm(props) {
    const [tableTemplate, setTableTemplate] = useState(null)
    const [tableData, setTableData] = useState(null)
    const [summaryData, setSummaryData] = useState(null)

    const isOperator = term => {
        return term === '+' || term === '-' || term === '*' || term === '/'
    }

    const isEvaluatable = (exp, summary) => {
        const terms = exp.split(' ')
        for (const [index, term] of terms.entries()) {
            if (term.startsWith('sum')) {
                const reg = /\(([^)]*)\)/;
                const selected = exp.match(reg)[1]
                const startCell = selected.split(':')[0]
                const endCell = selected.split(':')[1]
                const startRow = startCell.split('_')[1]
                const startCol = startCell.split('_')[2]
                const endRow = endCell.split('_')[1]
                const endCol = endCell.split('_')[2]

                //console.log(term)
                //data from user
                if (startCell.startsWith('#a1'))
                    continue
                //data in summary table

                //vertical
                if (startRow === endRow) {
                    const startC = Number(startCol.substring(1))
                    const endC = Number(endCol.substring(1))
                    for (var c = startC; c < endC; ++c) {
                        if (summary[`#b1_${startRow}_c${c}`] === undefined)
                            return false
                    }
                }
                //horizontal
                if (startCol === endCol) {
                    const startR = Number(startRow.substring(1))
                    const endR = Number(endRow.substring(1))
                    for (var r = startR; r < endR; ++r) {
                        if (summary[`#b1_r${r}_${startCol}`] === undefined)
                            return false
                    }
                }
                continue
            }
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

    const evalSummation = (exp, summary) => {
        const reg = /\(([^)]*)\)/;
        const selected = exp.match(reg)[1]
        const startCell = selected.split(':')[0]
        const endCell = selected.split(':')[1]
        const startRow = startCell.split('_')[1]
        const startCol = startCell.split('_')[2]
        const endRow = endCell.split('_')[1]
        const endCol = endCell.split('_')[2]

        const table = startCell.split('_')[0]

        //data from user
        if(table === '#a1') {
            //horizontal
            if (startRow === endRow) {
                var sum = 0;
                const startC = Number(startCol.substring(1))
                const endC = Number(endCol.substring(1))
                for (var c = startC; c <= endC; ++c) {
                    sum += Number(tableData[`#a1_${startRow}_c${c}`])
                }
                return sum
            }
            //vertical
            if (startCol === endCol) {
                var sum = 0
                const startR = Number(startRow.substring(1))
                const endR = Number(endRow.substring(1))
                for (var r = startR; r <= endR; ++r) {
                    sum += Number(tableData[`#a1_r${r}_${startCol}`])
                }
                return sum
            }
        }
        //data from summary
        if(table === '#b1') {
            //horizontal
            if (startRow === endRow) {
                var sum = 0;
                const startC = Number(startCol.substring(1))
                const endC = Number(endCol.substring(1))
                for (var c = startC; c <= endC; ++c) {
                    sum += Number(summary[`#b1_${startRow}_c${c}`])
                }
                return sum
            }
            //vertical
            if (startCol === endCol) {
                var sum = 0
                const startR = Number(startRow.substring(1))
                const endR = Number(endRow.substring(1))
                for (var r = startR; r <= endR; ++r) {
                    sum += Number(summary[`#b1_r${r}_${startCol}`])
                }
                return sum
            }
        }
    }

    const evaluate = (exp, summary) => {
        const terms = exp.split(' ')
        for (const [index, term] of terms.entries()) {
            if(term.startsWith('sum')) {
                terms[index] = evalSummation(term, summary)
                continue
            }
            if (isOperator(term))
                continue
            if (term.startsWith('#a1')) {
                terms[index] = tableData[term]
                continue
            }
            if (term.startsWith('#b1')) {
                terms[index] = summary[term]
                continue
            }
        }
        //console.log(mathEval(terms.join('')))
        return mathEval(terms.join(''))
    }

    const createSummaryData = () => {
        const summary = {}
        const queue = []
        console.log(tableData)
        for (const row of tableTemplate.rows) {
            for (const cell of row.columns) {
                if (cell.type === 'formula' && isEvaluatable(cell.value.substring(1), summary)) {
                    //console.log(cell.value)
                    summary[cell.key] = evaluate(cell.value.substring(1), summary)
                }
                else if (cell.type === 'formula') {
                    queue.push(cell)
                }
            }
        }
        //console.log(queue)
        if (queue.length > 0) {
            for (const cell of queue) {
                summary[cell.key] = evaluate(cell.value.substring(1), summary)
            }
        }
        setSummaryData(summary)
    }

    const loadTemplate = async () => {
        const res = await fetch('http://localhost:3001/summary-form-template', {
            method: 'GET',
        })
        setTableTemplate(await res.json())
    }
    
    const loadData = async () => {
        const res = await fetch('http://localhost:3001/user-data', {
            method: 'GET',
        })
        setTableData(await res.json(), () => createSummaryData())
    }

    useEffect(() => {
        loadTemplate()
        loadData()
    }, [])

    if (tableTemplate === null || tableData === null)
        return <div></div>

    summaryData === null && createSummaryData()
    return (
        <div>
            <div className="table-container">
                <table>
                    <tbody>
                        {tableTemplate.rows.map((row, rIndex) => {
                            return (
                                <tr style={{ height: tableTemplate.rowHeight[rIndex] }}>
                                    {row.columns.map((cell, cIndex) => {
                                        if(cell.isMerged)
                                            return
                                        if (cell.type === 'formula')
                                            return (
                                                <td
                                                    colSpan={cell.colSpan}
                                                    rowSpan={cell.rowSpan}
                                                    style={{
                                                        height: tableTemplate.rowHeight[rIndex],
                                                        width: tableTemplate.columnWidth[cIndex],
                                                        textAlign: 'center'
                                                    }}
                                                >
                                                    {summaryData === null ? '' : summaryData[cell.key]}
                                                </td>
                                            )
                                        else
                                            return (
                                                <td
                                                    colSpan={cell.colSpan}
                                                    rowSpan={cell.rowSpan}
                                                    style={{
                                                        height: tableTemplate.rowHeight[rIndex],
                                                        width: tableTemplate.columnWidth[cIndex],
                                                        textAlign: 'center'
                                                    }}
                                                >
                                                    {cell.value}
                                                </td>
                                            )
                                    })}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ViewSummaryForm
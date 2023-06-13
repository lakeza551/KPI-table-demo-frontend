import { evaluate as mathEval, sum } from 'mathjs'
import { useState, useEffect } from "react"
import userData2SummaryData from '../../utils/userData2SummaryData'
import TableSelectBar from '../fractions/TableSelectBar'

function ViewSummaryForm(props) {
    const {formTemplate, setFormTemplate, userData, setUserData} = props
    const [summaryData, setSummaryData] = useState(null)
    const [selectedTable, setSelectedTable] = useState(0)

    if (formTemplate === null || userData === null)
        return <div></div>

    summaryData === null && setSummaryData(userData2SummaryData(formTemplate, userData))
    const tableTemplate = formTemplate[selectedTable]

    return (
        <div className='content-container'>
            <TableSelectBar formTemplate={formTemplate} selectedTable={selectedTable} setSelectedTable={setSelectedTable}/>
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
                                                        ...cell.textareaStyle
                                                    }}
                                                >
                                                    <textarea disabled style={cell.textareaStyle} value={summaryData === null ? '' : summaryData[cell.key]}></textarea>
                                                </td>
                                            )
                                        else {
                                            console.log(cell.value)
                                            return (
                                                <td
                                                    colSpan={cell.colSpan}
                                                    rowSpan={cell.rowSpan}
                                                    style={{
                                                        height: tableTemplate.rowHeight[rIndex],
                                                        width: tableTemplate.columnWidth[cIndex],
                                                    }}
                                                >
                                                    <textarea disabled style={cell.textareaStyle} value={cell.value === null ? '' : cell.value}></textarea>
                                                </td>
                                            )
                                        }
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
import { evaluate as mathEval, sum } from 'mathjs'
import { useState, useEffect } from "react"
import userData2SummaryData from '../../utils/userData2SummaryData'
import TextareaAutosize from '@mui/base/TextareaAutosize';
import Select from 'react-select'

function TableSelectBar(props) {
    const {setSelectedTable, form} = props
    return (
        <div className="table-select-bar">
            <Select 
            className="custom-react-select"
            placeholder="-- โปรดระบุ --"
            defaultValue={{
                label: `ตารางที่ 1 ${form[0].name}`,
                value: 0
            }}
            onChange={selected => {
                console.log(selected)
                setSelectedTable(selected.value)
            }}
            options={form.map((table, index) => {
                return {
                    label: `ตารางที่ ${index + 1} ${table.name}`,
                    value: index
                }
            })}
            ></Select>
        </div>
    )
}

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
            <TableSelectBar form={formTemplate} setSelectedTable={setSelectedTable}/>
            <div className="table-container">
                <table>
                    <tbody>
                        {tableTemplate.rows.map((row, rIndex) => {
                            return (
                                <tr>
                                    {row.columns.map((cell, cIndex) => {
                                        if(cell.isMerged)
                                            return null
                                        if (cell.type === 'formula')
                                            return (
                                                <td
                                                    colSpan={cell.colSpan}
                                                    rowSpan={cell.rowSpan}
                                                    style={{
                                                        width: tableTemplate.columnWidth[cIndex],
                                                        ...cell.textareaStyle
                                                    }}
                                                >
                                                    <textarea disabled style={cell.textareaStyle} value={summaryData === null ? '' : summaryData[cell.key]}></textarea>
                                                </td>
                                            )
                                        else {
                                            //console.log(cell.value)
                                            return (
                                                <td
                                                    colSpan={cell.colSpan}
                                                    rowSpan={cell.rowSpan}
                                                    style={{
                                                        width: tableTemplate.columnWidth[cIndex],
                                                        ...cell.cellStyle
                                                    }}
                                                >
                                                    <TextareaAutosize disabled style={cell.textareaStyle} value={cell.value === null ? '' : cell.value}></TextareaAutosize>
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
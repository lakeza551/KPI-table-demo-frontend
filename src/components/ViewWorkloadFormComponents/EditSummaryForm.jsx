import { useEffect, useState } from "react"
import {CreateFormUtils} from '../../utils/createFormUtils'
import CellToolbox from "../fractions/CellToolbox"

function EditSummaryForm(props) {
    const [selectedTable, setSelectedTable] = useState(0)
    const tableActiveStyle = {
        fontWeight: 'bold',
        textDecoration: 'underline'
    }
    const {form, setForm} = props
    const [formStack, setFormStack] = useState([])
    const formUtils = new CreateFormUtils(form, setForm, selectedTable, setSelectedTable, 'summary-form', formStack, setFormStack)


    const compile = async () => {
        form.forEach((table, tIndex) => {
            table.rows.forEach((row, rIndex) => {
                row.columns.forEach((cell, cIndex) => {
                    console.log(cell)
                    if (cell.value === null)
                        cell.type = 'none'
                    else if (cell.value.startsWith('='))
                        cell.type = 'formula'
                    else
                        cell.type = 'comment'
                })
            })
        })
    }

    const load = async () => {
        const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/summary-form-template`, {
            method: 'GET',
        })
        setForm(await res.json())
        alert("Load Success")
    }

    const save = async () => {
        const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/summary-form-template`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(form)
        })
        alert("Save Success")
    }

    const TableSelectBar = () => {
        const tableCount = form.length
        return (
            <div className="table-select-bar">
                {Array.apply(null, Array(tableCount)).map((temp, index) => {
                    return (
                        <div className="table-select-bar-button-container">
                            <button style={index === selectedTable ? tableActiveStyle : undefined} onClick={() => {
                                setSelectedTable(index)
                            }}>ตารางที่ {index + 1}</button>
                            <button onClick={() => formUtils.deleteTable(index)} className="delete-table-button">ลบ</button>
                        </div>
                    )
                })}
                <button style={{
                    fontWeight: 'bold'
                }} onClick={() => {
                    formUtils.addTable()}
                }>เพิ่มตาราง</button>
            </div>
        )
    }

    useEffect(() => {
        if(form.length === 0)
            formUtils.initiateForm()
    }, [])

    if(form.length === 0)
        return
    
    const table = form[selectedTable]
    return (
        <div>
            <div className="float-button-bar">
                <button onClick={compile}>Compile</button>
                <button onClick={formUtils.undo}>Undo</button>
            </div>
            <TableSelectBar />
            <div className="table-container">
                <table>
                    <tbody>
                        {table.rows.map((row, rIndex) => {
                            return (
                                <tr style={{ height: table.rowHeight[rIndex] }}>
                                    {row.columns.map((cell, cIndex) => {
                                        if (cell.isMerged)
                                            return
                                        return (
                                            <td 
                                            colSpan={cell.colSpan} 
                                            rowSpan={cell.rowSpan} 
                                            style={{ 
                                                width: table.columnWidth[cIndex], 
                                                height: table.rowHeight[rIndex],
                                                ...cell.style 
                                            }}>
                                                <CellToolbox 
                                                    formUtils={formUtils}
                                                    form={form} 
                                                    setForm={setForm} 
                                                    selectedTable={selectedTable} 
                                                    rIndex={rIndex} 
                                                    cIndex={cIndex} 
                                                />
                                                <label style={{
                                                    color: cell.type === 'input' ? 'red' : 'black'
                                                }} className="cell-key">{cell.key ? cell.key : ''}</label>
                                                <textarea value={cell.value === null ? '' : cell.value} onChange={e => {
                                                    setForm(prev => {
                                                        cell.value = e.target.value
                                                        return [...prev]
                                                    })
                                                }}></textarea>
                                                <label className="cell-key">{cell.key}</label>
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

export default EditSummaryForm
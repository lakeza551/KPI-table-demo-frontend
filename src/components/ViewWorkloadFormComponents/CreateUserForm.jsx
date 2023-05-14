import { useEffect, useRef, useState } from "react"
import {CreateFormUtils} from '../../utils/createFormUtils'
import createCellKey from "../../utils/createCellKey"
import CellToolbox from "../fractions/CellToolbox"

function CreateUserForm(props) {
    const [selectedTable, setSelectedTable] = useState(0)
    const [selectedCell, setSelectedCell] = useState(null)
    const [form, setForm] = useState([])
    const [formStack, setFormStack] = useState([])
    const formUtils = new CreateFormUtils(form, setForm, selectedTable, setSelectedTable, 'user-form', formStack, setFormStack)

    const compile = () => {
        setForm(prev => {
            prev.forEach((table, tIndex) => {
                table.rows.forEach((row, rIndex) => {
                    row.columns.forEach((cell, cIndex) => {
                        cell.key = createCellKey('user-form', tIndex, rIndex, cIndex)
                        if (cell.value.startsWith('!input')) {
                            const [cellType, cellLabel] = cell.value.split(' ')
                            cell.type = cellType.substring(1)
                            if(cellLabel !== undefined)
                                cell.label = cellLabel
                        }
                        else
                            cell.type = 'comment'
                    })
                })
            })
            return [...prev]
        })
    }

    const load = async () => {
        const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/user-form-template`, {
            method: 'GET',
        })
        setForm(await res.json())
        alert("Load Success")
    }

    const save = async () => {
        const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/user-form-template`, {
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
                            <button onClick={() => {
                                //console.log(index)
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
        formUtils.initiateForm()
    }, [])
    if(form.length === 0)
        return

    const table = form[selectedTable]

    return (
        <div>
            <div className="float-button-bar">
                <button onClick={load}>Load</button>
                <button onClick={save}>Save</button>
                <button onClick={compile}>Compile</button>
                <button onClick={() => formUtils.undo(setForm)}>Undo</button>
            </div>
            <TableSelectBar form={form} setSelectedTable={setSelectedTable}/>
            <div className="table-container">
                <table>
                    <tbody>
                        {table.rows.map((row, rIndex) => {
                            return (
                                <tr style={{ height: table.rowHeight[rIndex] }}>
                                    {row.columns.map((cell, cIndex) => {
                                        if (cell.isMerged)
                                            return null
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
                                                    color: cell.type !== undefined && cell.type.startsWith('input') ? 'red' : 'black'
                                                }} className="cell-key">{cell.key ? cell.key : ''}</label>
                                                <textarea
                                                    onBlur={() => setSelectedCell(null)}
                                                    onFocus={() => setSelectedCell({
                                                        rIndex: rIndex,
                                                        cIndex: cIndex
                                                    })}
                                                    value={cell.value === null ? '' : cell.value}
                                                    onChange={e => {
                                                        setForm(prev => {
                                                            cell.value = e.target.value
                                                            return [...prev]
                                                        })
                                                    }}></textarea>
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

export default CreateUserForm
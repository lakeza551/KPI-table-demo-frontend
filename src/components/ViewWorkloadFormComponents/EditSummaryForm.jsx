import { useEffect, useState } from "react"
import {CreateFormUtils} from '../../utils/createFormUtils'
import CellToolbox from "../fractions/CellToolbox"
import Select from "react-select"

function TableSelectBar(props) {
    const {setSelectedTable, form} = props
    const tableCount = form.length
    return (
        <div className="table-select-bar">
            <Select 
            className="custom-react-select"
            placeholder="-- โปรดระบุ --"
            defaultValue={{
                label: 'ตารางที่ 1',
                value: 0
            }}
            onChange={selected => {
                setSelectedTable(selected.value)
            }}
            options={Array.apply(null, Array(tableCount)).map((temp, index) => {
                return {
                    label: `ตารางที่ ${index + 1}`,
                    value: index
                }
            })}
            ></Select>
        </div>
    )
}

function EditSummaryForm(props) {
    const [selectedTable, setSelectedTable] = useState(0)
    const tableActiveStyle = {
        fontWeight: 'bold',
        textDecoration: 'underline'
    }
    const {form, setForm} = props
    const [formStack, setFormStack] = useState([])
    const [showToolbox, setShowToolbox] = useState(null)
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
        alert('Compile สำเร็จ')
    }

    useEffect(() => {
        setShowToolbox(null)
    }, [selectedTable])

    useEffect(() => {
        if(form.length === 0)
            formUtils.initiateForm()
    }, [])

    if(form.length === 0)
        return
    
    const table = form[selectedTable]
    if(table === undefined) {
        setSelectedTable(0)
        return <div></div>
    }
    return (
        <div>
            <div className="float-button-bar">
                <button onClick={compile}>Compile</button>
                <button onClick={() => formUtils.undo()}>Undo</button>
            </div>
            <TableSelectBar setSelectedTable={setSelectedTable} form={form}/>
            <div className="table-name-input">
                <label>ชื่อตาราง</label>
                <input onChange={e => setForm(prev => {
                    table.name = e.target.value
                    return [...prev]
                })} value={table.name === undefined ? '' : table.name} type="text" />
            </div>
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
                                            {showToolbox !== null &&
                                             showToolbox.cIndex === cIndex &&
                                             showToolbox.rIndex === rIndex &&
                                             <CellToolbox 
                                                    formUtils={formUtils}
                                                    form={form} 
                                                    setForm={setForm} 
                                                    selectedTable={selectedTable} 
                                                    rIndex={rIndex} 
                                                    cIndex={cIndex} 
                                                />}
                                                <label style={{
                                                    color: cell.type === 'input' ? 'red' : 'black'
                                                }} className="cell-key">{cell.key ? cell.key : ''}</label>
                                                <textarea 
                                                style={cell.textareaStyle} 
                                                value={cell.value === null ? '' : cell.value} 
                                                onClick={() => setShowToolbox(null)}
                                                onContextMenu={e => {
                                                    e.preventDefault()
                                                    setShowToolbox({
                                                        rIndex: rIndex,
                                                        cIndex: cIndex
                                                    })
                                                }}
                                                onChange={e => {
                                                    setForm(prev => {
                                                        cell.value = e.target.value
                                                        return [...prev]
                                                    })
                                                }}>
                                                </textarea>
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
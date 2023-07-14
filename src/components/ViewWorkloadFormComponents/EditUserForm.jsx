import { useEffect, useRef, useState } from "react"
import { CreateFormUtils } from '../../utils/createFormUtils'
import Select from 'react-select'
import createCellKey from "../../utils/createCellKey"
import CellToolbox from "../fractions/CellToolbox"
import TextareaAutosize from '@mui/base/TextareaAutosize';

function TableSelectBar(props) {
    const {selectedTable, setSelectedTable, form, formUtils} = props
    return (
        <div className="table-select-bar">
            <Select 
            className="custom-react-select"
            placeholder="-- โปรดระบุ --"
            value={{
                label: `ตารางที่ ${selectedTable + 1}   ${form[selectedTable].name === undefined ? '' : form[selectedTable].name}`,
                value: selectedTable
            }}
            onChange={selected => {
                setSelectedTable(selected.value)
            }}
            options={form.map((table, index) => {
                return {
                    label: `ตารางที่ ${index + 1}   ${table.name === undefined ? '' : table.name}`,
                    value: index
                }
            })}
            ></Select>
            <button onClick={() => formUtils.addTable(selectedTable)}>เพิ่มตารางก่อนหน้า</button>
            <button onClick={() => formUtils.addTable(selectedTable + 1)}>เพิ่มตารางถัดไป</button>
            <button onClick={() => formUtils.deleteTable(selectedTable)}>ลบตาราง</button>
        </div>
    )
}

function EditUserForm(props) {
    const [selectedTable, setSelectedTable] = useState(0)
    const tableActiveStyle = {
        fontWeight: 'bold',
        textDecoration: 'underline'
    }
    const [showToolbox, setShowToolbox] = useState(null)
    const [selectedCell, setSelectedCell] = useState(null)
    const { form, setForm } = props
    const [formStack, setFormStack] = useState([])
    const formUtils = new CreateFormUtils(form, setForm, selectedTable, setSelectedTable, 'user-form', formStack, setFormStack)

    const compile = () => {
        setForm(prev => {
            prev.forEach((table, tIndex) => {
                table.rows.forEach((row, rIndex) => {
                    row.columns.forEach((cell, cIndex) => {
                        cell.key = createCellKey('user-form', tIndex, rIndex, cIndex)
                        if (cell.value !== null && cell.value.startsWith('!input')) {
                            const [cellType, cellLabel] = cell.value.split(' ')
                            cell.type = cellType.substring(1)
                            if (cellLabel !== undefined)
                                cell.label = cellLabel
                            else
                                cell.label = ''
                        }
                        else
                            cell.type = 'comment'
                    })
                })
            })
            return [...prev]
        })
        alert('Compile สำเร็จ')
    }

    useEffect(() => {
        setShowToolbox(null)
    }, [selectedTable])

    useEffect(() => {
        if (form.length === 0)
            formUtils.initiateForm()
    }, [])
    if (form.length === 0)
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
            <TableSelectBar 
            form={form} 
            formUtils={formUtils} 
            selectedTable={selectedTable} 
            setSelectedTable={setSelectedTable} />
            <div className="table-name-input">
                <label>ชื่อตาราง</label>
                <input onChange={e => setForm(prev => {
                    table.name = e.target.value
                    return [...prev]
                })} value={table.name === undefined ? '' : table.name} type="text" />
            </div>
            <div className="table-container" style={{
                overflow: 'auto',
                paddingBottom: '400px'
            }}>
                <table>
                    <tbody>
                        {table.rows.map((row, rIndex) => {
                            return (
                                <tr>
                                    {row.columns.map((cell, cIndex) => {
                                        if (cell.isMerged)
                                            return null
                                        return (
                                            <td
                                                onContextMenu={e => {
                                                    e.preventDefault()
                                                    const bound = e.target.getBoundingClientRect()
                                                    setShowToolbox({
                                                        rIndex: rIndex,
                                                        cIndex: cIndex,
                                                        pageX: e.clientX - bound.left,
                                                        pageY: e.clientY - bound.top
                                                    })
                                                }}
                                                colSpan={cell.colSpan}
                                                rowSpan={cell.rowSpan}
                                                style={{
                                                    width: table.columnWidth[cIndex],
                                                    paddingBottom: '20px',
                                                    ...cell.cellStyle
                                                }}>
                                                {showToolbox !== null &&
                                                    showToolbox.cIndex === cIndex &&
                                                    showToolbox.rIndex === rIndex &&
                                                    <CellToolbox
                                                        formUtils={formUtils}
                                                        pageX={showToolbox.pageX}
                                                        pageY={showToolbox.pageY}
                                                        rIndex={rIndex}
                                                        cIndex={cIndex}
                                                    />}
                                                <label style={{
                                                    color: cell.type !== undefined && cell.type.startsWith('input') ? 'red' : 'black'
                                                }} className="cell-key">{cell.key ? cell.key : ''}</label>
                                                <TextareaAutosize
                                                    onBlur={() => setSelectedCell(null)}
                                                    onFocus={() => setSelectedCell({
                                                        rIndex: rIndex,
                                                        cIndex: cIndex
                                                    })}
                                                    style={cell.textareaStyle}
                                                    value={cell.value === null ? '' : cell.value}
                                                    onClick={() => setShowToolbox(null)}
                                                    onKeyDown={e => {
                                                        e.preventDefault()
                                                        if(e.ctrlKey && e.key === 'm')
                                                            formUtils.addTextareaStyle(rIndex, cIndex, {
                                                                textAlign: 'center'
                                                            })
                                                        if(e.ctrlKey && e.key === 'l')
                                                            formUtils.addTextareaStyle(rIndex, cIndex, {
                                                                textAlign: 'left'
                                                            })
                                                        if(e.ctrlKey && e.key === 'r')
                                                            formUtils.addTextareaStyle(rIndex, cIndex, {
                                                                textAlign: 'right'
                                                            })
                                                    }}
                                                    onChange={e => {
                                                        setForm(prev => {
                                                            cell.value = e.target.value
                                                            return [...prev]
                                                        })
                                                    }}></TextareaAutosize>
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

export default EditUserForm
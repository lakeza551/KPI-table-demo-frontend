import { useEffect, useState } from "react"
import { CreateFormUtils } from '../../utils/createFormUtils'
import CellToolbox from "../fractions/CellToolbox"
import Select from "react-select"
import TextareaAutosize from '@mui/base/TextareaAutosize';

function TableSelectBar(props) {
    const { selectedTable, setSelectedTable, form, formUtils } = props
    return (
        <div className="table-select-bar">
            <Select
                className="custom-react-select"
                placeholder="-- โปรดระบุ --"
                value={{
                    label: `ตารางที่ ${selectedTable + 1} ${form[selectedTable].name === undefined ? '' : form[selectedTable].name}`,
                    value: selectedTable
                }}
                onChange={selected => {
                    setSelectedTable(selected.value)
                }}
                options={form.map((table, index) => {
                    return {
                        label: `ตารางที่ ${index + 1} ${table.name === undefined ? '' : table.name}`,
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

function EditSummaryForm(props) {
    const [selectedTable, setSelectedTable] = useState(0)
    const tableActiveStyle = {
        fontWeight: 'bold',
        textDecoration: 'underline'
    }
    const { form, setForm } = props
    const [formStack, setFormStack] = useState([])
    const [showToolbox, setShowToolbox] = useState(null)
    const formUtils = new CreateFormUtils(form, setForm, selectedTable, setSelectedTable, 'summary-form', formStack, setFormStack)


    const compile = async () => {
        form.forEach((table, tIndex) => {
            table.rows.forEach((row, rIndex) => {
                row.columns.forEach((cell, cIndex) => {
                    // console.log(cell)
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
        if (form.length === 0)
            formUtils.initiateForm()
    }, [])

    if (form.length === 0)
        return

    const table = form[selectedTable]
    if (table === undefined) {
        setSelectedTable(0)
        return <div></div>
    }
    return (
        <div>
            <div className="float-button-bar">
                <button onClick={compile}>Compile</button>
                <button onClick={() => formUtils.undo()}>Undo</button>
            </div>
            <TableSelectBar formUtils={formUtils} selectedTable={selectedTable} setSelectedTable={setSelectedTable} form={form} />
            <div className="table-name-input">
                <label>ชื่อตาราง</label>
                <input onChange={e => setForm(prev => {
                    table.name = e.target.value
                    return [...prev]
                })} value={table.name === undefined ? '' : table.name} type="text" />
            </div>
            <div 
            className="table-container" style={{
                paddingTop: '150px',
                paddingBottom: '400px'
            }}>
                <table>
                    <tbody>
                        {table.rows.map((row, rIndex) => {
                            return (
                                <tr>
                                    {row.columns.map((cell, cIndex) => {
                                        if (cell.isMerged)
                                            return
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
                                                    paddingBottom: '25px',
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
                                                    color: cell.type === 'input' ? 'red' : 'black'
                                                }} className="cell-key">{cell.key ? cell.key : ''}</label>
                                                <TextareaAutosize
                                                    style={cell.textareaStyle}
                                                    value={cell.value === null ? '' : cell.value}
                                                    onClick={() => setShowToolbox(null)}
                                                    onChange={e => {
                                                        setForm(prev => {
                                                            cell.value = e.target.value
                                                            return [...prev]
                                                        })
                                                    }}
                                                    onKeyDown={e => {
                                                        if (e.ctrlKey && (e.key.toLocaleLowerCase() === 'm')) {
                                                            e.preventDefault()
                                                            formUtils.addTextareaStyle(rIndex, cIndex, {
                                                                textAlign: 'center'
                                                            })
                                                        }
                                                        if (e.ctrlKey && e.key.toLocaleLowerCase() === 'l') {
                                                            e.preventDefault()
                                                            formUtils.addTextareaStyle(rIndex, cIndex, {
                                                                textAlign: 'left'
                                                            })
                                                        }
                                                        if (e.ctrlKey && e.key.toLocaleLowerCase() === 'r') {
                                                            e.preventDefault()
                                                            formUtils.addTextareaStyle(rIndex, cIndex, {
                                                                textAlign: 'right'
                                                            })
                                                        }
                                                    }}>
                                                </TextareaAutosize>
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
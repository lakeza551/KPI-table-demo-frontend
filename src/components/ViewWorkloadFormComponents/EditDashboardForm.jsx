import { useEffect, useState } from "react"
import {CreateFormUtils} from '../../utils/createFormUtils'
import DashboardCellToolbox from "../fractions/DashboardCellToolbox"
import callApi from "../../utils/callApi"

function EditDashboardForm(props) {
    const [selectedTable, setSelectedTable] = useState(0)
    const {form, setForm, userFormTemplate} = props
    const [showToolbox, setShowToolbox] = useState(null)
    const [formStack, setFormStack] = useState([])
    const formUtils = new CreateFormUtils(form, setForm, selectedTable, setSelectedTable, 'dashboard-form', formStack, setFormStack)

    const [departmentList, setDepartmentList] = useState([])

    const fetchDepartmentList = async () => {
        const res = await callApi(`${process.env.REACT_APP_SERVER_URL}/group/`, 'GET', null)
        const resData = await res.json()
        setDepartmentList(resData.data)
    }

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

    const createDashboardData = async () => {
        const dashboardForm = form[0]
        for(const row of dashboardForm.rows) {
            const firstCell = row.columns[0]
            if(firstCell.value !== null && firstCell.value.startsWith('!department')) {
                const res = await callApi(`${process.env.REACT_APP_SERVER_URL}/`)
            }
        }
    }

    useEffect(() => {
        setShowToolbox(null)
    }, [selectedTable])

    useEffect(() => {
        if(form.length === 0)
            return
        createDashboardData()
    }, [form])



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
        fetchDepartmentList()
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
                <button onClick={() => formUtils.undo()}>Undo</button>
            </div>
            {/* <TableSelectBar /> */}
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
                                                height: table.rowHeight[rIndex],
                                                ...cell.style 
                                            }}>
                                                {showToolbox !== null &&
                                                showToolbox.cIndex === cIndex &&
                                                showToolbox.rIndex === rIndex &&
                                                <DashboardCellToolbox
                                                    formUtils={formUtils}
                                                    form={form}
                                                    pageX={showToolbox.pageX}
                                                    pageY={showToolbox.pageY}
                                                    setForm={setForm}
                                                    selectedTable={selectedTable}
                                                    rIndex={rIndex}
                                                    cIndex={cIndex}
                                                    departmentList={departmentList}
                                                />}
                                                <label style={{
                                                    color: cell.type === 'input' ? 'red' : 'black'
                                                }} className="cell-key">{cell.key ? cell.key : ''}</label>
                                                <textarea
                                                onClick={() => setShowToolbox(null)}
                                                onContextMenu={e => {
                                                    e.preventDefault()
                                                    setShowToolbox({
                                                        rIndex: rIndex,
                                                        cIndex: cIndex
                                                    })
                                                }}
                                                style={cell.textareaStyle}
                                                value={cell.value === null ? '' : cell.value} 
                                                onChange={e => {
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

export default EditDashboardForm
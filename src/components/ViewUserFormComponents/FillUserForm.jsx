import { useEffect, useState } from "react"
import callApi from "../../utils/callApi"
import Select from 'react-select'


function TableSelectBar(props) {
    const {setSelectedTable, form} = props
    console.log(form)
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

function FillUserForm(props) {
    const {formTemplate, setFormTemplate, formData, setFormData, semesterId, userId, save, disabled} = props
    const [selectedTable, setSelectedTable] = useState(0)



    if (formTemplate === null)
        return <div></div>

    if(formData === null)
        return (
            <div className="page-content-container">
                <h1>ผู้ใช้ยังไม่เคยกรอกข้อมูล</h1>
            </div>
        )

    const tableTemplate = formTemplate[selectedTable]

    return (
        <div className="content-container">
            <div className="button-bar">
                <button className="table-button" onClick={save}>Save</button>
            </div>
            <TableSelectBar form={formTemplate} setSelectedTable={setSelectedTable}/>
            <div className="table-container">
                <table>
                    <tbody>
                        {tableTemplate.rows.map((row, rIndex) => {
                            return (
                                <tr style={{ height: tableTemplate.rowHeight[rIndex] }}>
                                    {row.columns.map((cell, cIndex) => {
                                        if (cell.isMerged)
                                            return null
                                        var TableContent
                                        //is input
                                        if (cell.type.startsWith('input')) {
                                            const inputType = cell.type.split('#')[1]
                                            if(inputType === 'text') {
                                                const startText = cell.label === undefined ? '' : cell.label
                                                if(rIndex === 2) {
                                                    console.log(formData[cell.key])
                                                    console.log(startText)
                                                }
                                                TableContent = (
                                                    <textarea disabled={disabled} style={cell.textareaStyle} value={formData[cell.key] === null || formData[cell.key] === undefined ? startText : startText + formData[cell.key]} onChange={e => {
                                                        setFormData(prev => {
                                                            if(e.target.value.length < startText.length)
                                                                e.target.value = startText
                                                            if(e.target.value.substring(startText.length) === '')
                                                                prev[cell.key] = null
                                                            else
                                                                prev[cell.key] = e.target.value.substring(startText.length)
                                                            console.log(prev[cell.key])
                                                            return { ...prev }
                                                        })
                                                    }}></textarea>
                                                )
                                            }
                                            else if(inputType === 'number') {
                                                TableContent = (
                                                    <input disabled={disabled} style={cell.textareaStyle} type="number" value={formData[cell.key] === null || formData[cell.key] === undefined ? '' : formData[cell.key]} onChange={e => {
                                                        setFormData(prev => {
                                                            prev[cell.key] = e.target.value
                                                            return { ...prev }
                                                        })
                                                    }}/>
                                                )
                                            }
                                            else if(inputType === 'checkbox') {
                                                TableContent = (
                                                    <div>
                                                        <input disabled={disabled} style={cell.textareaStyle} type="checkbox" checked={formData[cell.key] === null || formData[cell.key] === undefined ? false : formData[cell.key]} onChange={e => {
                                                            setFormData(prev => {
                                                                prev[cell.key] = e.target.checked
                                                                return {...prev}
                                                            })
                                                        }} />
                                                        <label style={{marginLeft: '10px'}}>{cell.label}</label>
                                                    </div>
                                                )
                                            }
                                        }
                                        //is comment
                                        else {
                                            TableContent = (<textarea style={cell.textareaStyle} disabled={true} value={cell.value === undefined || cell.value === null ? '' : cell.value} ></textarea>)
                                        }
                                        return (
                                            <td colSpan={cell.colSpan} rowSpan={cell.rowSpan} style={{ width: tableTemplate.columnWidth[cIndex], height: tableTemplate.rowHeight[rIndex] }}>
                                                {TableContent}
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

export default FillUserForm
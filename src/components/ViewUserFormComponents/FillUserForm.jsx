import { useEffect, useState } from "react"
import callApi from "../../utils/callApi"
import Select from 'react-select'
import TextareaAutosize from '@mui/base/TextareaAutosize';


function TableSelectBar(props) {
    const { setSelectedTable, form } = props
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
    const { formTemplate, setFormTemplate, formData, setFormData, save, disabled } = props
    const [selectedTable, setSelectedTable] = useState(0)



    if (formTemplate === null)
        return <div></div>

    if (formData === null)
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
            <TableSelectBar form={formTemplate} setSelectedTable={setSelectedTable} />
            <div className="table-container">
                <table>
                    <tbody>
                        {tableTemplate.rows.map((row, rIndex) => {
                            return (
                                <tr>
                                    {row.columns.map((cell, cIndex) => {
                                        if (cell.isMerged)
                                            return null
                                        var TableContent
                                        //is input
                                        if (cell.type.startsWith('input')) {
                                            const inputType = cell.type.split('#')[1]
                                            if (inputType === 'text') {
                                                const startText = cell.label === undefined ? '' : cell.label
                                                TableContent = (
                                                    <TextareaAutosize
                                                        onDurationChangeCapture={e => {
                                                            console.log(e)
                                                        }}
                                                        minRows={1}
                                                        disabled={disabled}
                                                        value={formData[cell.key] === null || formData[cell.key] === undefined ? startText : startText + formData[cell.key]} onChange={e => {
                                                            setFormData(prev => {
                                                                if (e.target.value.length < startText.length)
                                                                    e.target.value = startText
                                                                if (e.target.value.substring(startText.length) === '')
                                                                    prev[cell.key] = null
                                                                else
                                                                    prev[cell.key] = e.target.value.substring(startText.length)
                                                                return { ...prev }
                                                            })
                                                        }}></TextareaAutosize>
                                                )
                                            }
                                            else if (inputType === 'number') {
                                                TableContent = (
                                                    <input onClick={e => e.stopPropagation()} disabled={disabled} type="number" value={formData[cell.key] === null || formData[cell.key] === undefined ? '' : formData[cell.key]} onChange={e => {
                                                        setFormData(prev => {
                                                            prev[cell.key] = e.target.value
                                                            return { ...prev }
                                                        })
                                                    }} />
                                                )
                                            }
                                            else if (inputType === 'checkbox') {
                                                TableContent = (
                                                    <div>
                                                        <input disabled={disabled} type="checkbox" checked={formData[cell.key] === null || formData[cell.key] === undefined ? false : formData[cell.key]} onChange={e => {
                                                            setFormData(prev => {
                                                                prev[cell.key] = e.target.checked
                                                                return { ...prev }
                                                            })
                                                        }} />
                                                        <label style={{ marginLeft: '10px' }}>{cell.label}</label>
                                                    </div>
                                                )
                                            }
                                            else if (inputType === 'file') {
                                                console.log(formData[cell.key])
                                                TableContent = (
                                                    <div>
                                                        <input disabled={disabled} type="file" onChange={e => {
                                                            setFormData(prev => {
                                                                prev[cell.key] = e.target.files[0]
                                                                return { ...prev }
                                                            })
                                                        }} />
                                                        <label
                                                            onClick={async e => {
                                                                const res = await callApi(`${process.env.REACT_APP_SERVER_URL}${formData[cell.key].filepath}`, 'GET')
                                                                const file = await res.blob()
                                                                var a = document.createElement("a");
                                                                a.href = window.URL.createObjectURL(file);
                                                                a.download = formData[cell.key].filename;
                                                                a.click();
                                                            }}
                                                            style={{
                                                                fontWeight: 'bold',
                                                                margin: '5px',
                                                                cursor: 'pointer'
                                                            }}>{formData[cell.key].filename}</label>
                                                    </div>
                                                )
                                            }
                                        }
                                        //is comment
                                        else {
                                            TableContent = (
                                                <TextareaAutosize
                                                    disabled={true}
                                                    style={cell.textareaStyle}
                                                    value={cell.value === undefined || cell.value === null ? '' : cell.value} >
                                                </TextareaAutosize>)
                                        }
                                        return (
                                            <td
                                                colSpan={cell.colSpan}
                                                rowSpan={cell.rowSpan}
                                                style={
                                                    {
                                                        width: tableTemplate.columnWidth[cIndex],
                                                        ...cell.cellStyle
                                                    }
                                                }>
                                                {TableContent}
                                            </td>
                                        )
                                    })}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                {/* <TextareaAutosize></TextareaAutosize> */}
            </div>
        </div>
    )
}

export default FillUserForm
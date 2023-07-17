import { useEffect, useState, useRef } from "react"
import callApi from "../../utils/callApi"
import Select from 'react-select'
import TextareaAutosize from '@mui/base/TextareaAutosize';


function TableSelectBar(props) {
    const { selectedTable, setSelectedTable, form } = props
    return (
        <div className="table-select-bar">
            <Select
                className="custom-react-select"
                placeholder="-- โปรดระบุ --"
                // defaultValue={{
                //     label: `ตารางที่ 1   ${form[selectedTable].name}`,
                //     value: selectedTable
                // }}
                value={{
                    label: `ตารางที่ ${selectedTable + 1}   ${form[selectedTable].name}`,
                    value: selectedTable
                }}
                onChange={selected => {
                    setSelectedTable(selected.value)
                }}
                options={form.map((table, index) => {
                    return {
                        label: `ตารางที่   ${index + 1} ${table.name}`,
                        value: index
                    }
                })}
            ></Select>
        </div>
    )
}

function FillUserForm(props) {
    const { formTemplate, setFormTemplate, formData, setFormData, save, disabled, semesterId } = props
    const inputRef = useRef({})
    const [selectedTable, setSelectedTable] = useState(0)
    const focusInput = key => {
        inputRef.current[key] && inputRef.current[key].focus()
    }


    useEffect(() => {
        setSelectedTable(0)
    }, [semesterId])

    if (formTemplate === null)
        return <div></div>

    if (formData === null)
        return (
            <div className="page-content-container">
                <h1>ผู้ใช้ยังไม่เคยกรอกข้อมูล</h1>
            </div>
        )

    const tableTemplate = formTemplate[selectedTable]
    console.log(formData['#a16_A12'])
    return (
        <div className="content-container">
            <div className="button-bar">
                <button className="table-button" onClick={save}>Save</button>
            </div>
            <TableSelectBar form={formTemplate} setSelectedTable={setSelectedTable} selectedTable={selectedTable}/>
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
                                        var cellColor = 'transparent'
                                        //is input
                                        if (cell.type.startsWith('input')) {
                                            const inputType = cell.type.split('#')[1]
                                            if (inputType === 'text') {
                                                const startText = cell.label === undefined ? '' : cell.label
                                                TableContent = (
                                                    <TextareaAutosize
                                                        ref={element => inputRef.current[cell.key] = element}
                                                        style={cell.textareaStyle}
                                                        minRows={1}
                                                        disabled={disabled}
                                                        value={formData[cell.key] === null || formData[cell.key] === undefined ? startText : startText + formData[cell.key]} 
                                                        onChange={e => {
                                                            setFormData(prev => {
                                                                if (e.target.value.length < startText.length)
                                                                    e.target.value = startText
                                                                if (e.target.value.substring(startText.length) === '')
                                                                    prev[cell.key] = null
                                                                else
                                                                    prev[cell.key] = e.target.value.substring(startText.length)
                                                                return { ...prev }
                                                            })
                                                        }}
                                                        ></TextareaAutosize>
                                                )
                                            }
                                            else if (inputType === 'number') {
                                                TableContent = (
                                                    <input
                                                    style={cell.textareaStyle}
                                                    ref={element => inputRef.current[cell.key] = element} 
                                                    onClick={e => e.stopPropagation()} 
                                                    disabled={disabled} 
                                                    type="number" 
                                                    value={formData[cell.key] === null || formData[cell.key] === undefined ? '' : formData[cell.key]} onChange={e => {
                                                        setFormData(prev => {
                                                            prev[cell.key] = e.target.value
                                                            return { ...prev }
                                                        })
                                                    }} />
                                                )
                                            }
                                            else if (inputType === 'checkbox') {
                                                TableContent = (
                                                    <div style={{
                                                        margin: '10px',
                                                        display: 'flex',
                                                        justifyContent: cell.textareaStyle ? cell.textareaStyle.textAlign : 'center',
                                                        alignItems: 'center'
                                                    }}>
                                                        <input 
                                                        disabled={disabled} 
                                                        type="checkbox" 
                                                        checked={formData[cell.key] === null || formData[cell.key] === undefined ? false : formData[cell.key]} onChange={e => {
                                                            setFormData(prev => {
                                                                prev[cell.key] = e.target.checked
                                                                return { ...prev }
                                                            })
                                                        }} />
                                                        <label style={{ 
                                                            marginLeft: '10px',
                                                            fontSize: '18px'
                                                        }}>{cell.label}</label>
                                                    </div>
                                                )
                                            }
                                            else if (inputType === 'file') {
                                                //console.log(formData[cell.key])
                                                TableContent = (
                                                    <div style={{margin: '5px'}}>
                                                        <label style={{marginRight: '5px', fontWeight:'bold'}}>{cell.label ? cell.label : ''}</label>
                                                        <input 
                                                        disabled={disabled} 
                                                        type="file" onChange={e => {
                                                            setFormData(prev => {
                                                                prev[cell.key] = e.target.files[0]
                                                                return { ...prev }
                                                            })
                                                        }} />
                                                        {(formData[cell.key] !== null && formData[cell.key] !== undefined) && <label
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
                                                            }}>{formData[cell.key].filename}</label>}
                                                    </div>
                                                )
                                            }
                                        }
                                        //is comment
                                        else {
                                            cellColor = '#E0E0E0'
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
                                                onClick={() => focusInput(cell.key)}
                                                style={
                                                    {
                                                        width: tableTemplate.columnWidth[cIndex],
                                                        ...cell.cellStyle,
                                                        backgroundColor: cellColor
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
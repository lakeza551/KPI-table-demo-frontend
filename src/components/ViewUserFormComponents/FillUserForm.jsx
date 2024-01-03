import { useEffect, useState, useRef } from "react"
import callApi from "../../utils/callApi"
import Select from 'react-select'
import TextareaAutosize from '@mui/base/TextareaAutosize';
import { ClipLoader } from "react-spinners";
import { FiCheckCircle } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import { ImCross } from "react-icons/im";

function SaveIndicator(props) {
    const {saveState} = props
    const textStyle = {
        textAlign: 'center',
        marginLeft: '10px',
        fontWeight: 'bolder'
    }
    if(saveState.status === 'pending') {
        return (
            <div className="save-indicator" style={{
                backgroundColor: '#fff3cd',
                border: '1px solid #ffecb5'
            }}>
                <ClipLoader color="#664d03" size={20}/>
                <span style={{
                    ...textStyle,
                    color: '#664d03'
                }}>กำลังบันทึก</span>
            </div>
        )
    }
    if(saveState.status === 'success') {
        return (
            <div className="save-indicator" style={{
                backgroundColor: '#d1e7dd',
                border: '1px solid #badbcc'
            }}>
                <FiCheckCircle color="#0f5132" size={20}/>
                <span style={{
                    ...textStyle,
                    color: '#0f5132'
                }}>บันทึกสำเร็จ {saveState.time}</span>
            </div>
        )
    }
    if(saveState.status === 'failed') {
        return (
            <div className="save-indicator" style={{
                backgroundColor: '#f8d7da',
                border: '1px solid #f5c2c7'
            }}>
                <RxCross2 color="#842029" size={25}/>
                <span style={{
                    ...textStyle,
                    color: '#842029'
                }}>บันทึกล้มเหลว {saveState.time}</span>
            </div>
        )
    }
}

function TableSelectBar(props) {
    const { selectedTable, setSelectedTable, form, saveState } = props
    return (
        <div className="table-select-bar" style={{
            justifyContent: 'space-between'
        }}>
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
            {saveState !== null && <SaveIndicator saveState={saveState}/>}
        </div>
    )
}

function FillUserForm(props) {
    const { formTemplate, setFormTemplate, formData, setFormData, saveFilesUrl, saveFormDataUrl, disabled, semesterId} = props

    const inputRef = useRef({})
    const [selectedTable, setSelectedTable] = useState(0)
    const [dataChanged, setDataChanged] = useState(false)
    const [saveTimeout, setSaveTimeout] = useState(null)
    const [saveInterval, setSaveInterval] = useState(null)
    const [saveState, setSaveState] = useState(null)
    const focusInput = key => {
        inputRef.current[key] && inputRef.current[key].focus()
    }

    //auto save when data change
    useEffect(() => {
        if(formData === null || !dataChanged)
            return
        setSaveState({
            status: 'pending'
        })
        if(saveTimeout !== null)
            clearTimeout(saveTimeout)
        setSaveTimeout(setTimeout(() => {
            save()
            setSaveTimeout(null)
        }, 2000))
    }, [formData])


    const save = async () => {
        try {
            setSaveState({
                status: 'pending'
            })
            const arrFiles = Object.entries(formData).filter(([key, val]) => val !== null && typeof val === 'object')
            for(const [key, file] of arrFiles) {
                if(!(file instanceof File))
                    continue
                const data = new FormData()
                data.append('file', file)
                //console.log(data)
                const res = await callApi(saveFilesUrl, 'POST', data, true)
                // const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/semester/${selectedSemester}/upload/${selectedUser}/`, {
                //     headers: {
                //         'Authorization' : `Bearer ${workloadCookie.access_token}`, 
                //     },
                //     method: 'POST',
                //     body: data
                // })
                const resData = await res.json()
                //console.log(resData)
                if(resData.status === 'error' || resData.status === 'fail')
                    throw resData.data
                formData[key] = {
                    filename: resData.data.filename,
                    filepath: resData.data.url
                }
                // setUserRawData(prev => {
                //     prev[key] = {
                //         filename: resData.data.filename,
                //         filepath: resData.data.url
                //     }
                //     return {...prev}
                // })
            }
            const res = await callApi(saveFormDataUrl, 'PUT', formData)
            const resData = await res.json()
            const date = new Date()
            if(resData.status === 'success') {
                setSaveState({
                    status: 'success',
                    time: date.toLocaleDateString() + " " + date.toLocaleTimeString()
                })
                // return alert('บันทึกข้อมูลสำเร็จ')
            }
            else
                throw resData.data
        } catch (error) {
            console.log(error)
            const date = new Date()
            setSaveState({
                status: 'failed',
                time: date.toLocaleDateString() + " " + date.toLocaleTimeString(),
                error: error
            })
            // alert('บันทึกข้อมูลล้มเหลว\n' + error)
        }
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

    var tableTemplate = formTemplate[selectedTable]
    return (
        <div className="content-container">
            <div className="button-bar">
                <button className="table-button" onClick={save}>Save</button>
            </div>
            <TableSelectBar form={formTemplate} setSelectedTable={setSelectedTable} selectedTable={selectedTable} saveState={saveState}/>
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
                                                            setDataChanged(true)
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
                                                    placeholder={cell.label}
                                                    type="number" 
                                                    value={formData[cell.key] === null || formData[cell.key] === undefined ? '' : formData[cell.key]} onChange={e => {
                                                        setDataChanged(true)
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
                                                        checked={formData[cell.key] === null || formData[cell.key] === undefined || typeof formData[cell.key] !== 'boolean' ? false : formData[cell.key]} onChange={e => {
                                                            setDataChanged(true)
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
                                                            setDataChanged(true)
                                                            setFormData(prev => {
                                                                prev[cell.key] = e.target.files[0]
                                                                return { ...prev }
                                                            })
                                                        }} />
                                                        {(formData[cell.key] !== null && formData[cell.key] !== undefined && typeof formData[cell.key] === 'object') && <label
                                                            className="download-filename"
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
                                                            }}>{formData[cell.key].filename}
                                                            <div 
                                                                className="file-delete"
                                                                onClick={e => {
                                                                    setDataChanged(true)
                                                                    setFormData(prev => {
                                                                        prev[cell.key] = null
                                                                        return {...prev}
                                                                    })
                                                                }}
                                                            >
                                                                <ImCross color="red" size={15}/>
                                                            </div>
                                                            </label>}
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
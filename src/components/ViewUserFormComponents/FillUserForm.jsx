import { useEffect, useState, useRef } from "react"
import callApi from "../../utils/callApi"
import Select from 'react-select'
import TextareaAutosize from '@mui/base/TextareaAutosize';
import { ClipLoader } from "react-spinners";
import { FiCheckCircle } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import { ImCross } from "react-icons/im";
import { GrFormClose } from 'react-icons/gr'
import verifyImportedData from "../../utils/verifyImportedData";

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
        alert(saveState.error)
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
    const { formTemplate, setFormTemplate, formData, setFormData, saveFilesUrl, saveFormDataUrl, disabled, semesterId, semesterTitle} = props
    console.log(semesterId, semesterTitle)

    const inputRef = useRef({})
    const [selectedTable, setSelectedTable] = useState(0)
    const [dataChanged, setDataChanged] = useState(false)
    const [saveTimeout, setSaveTimeout] = useState(null)
    const [saveState, setSaveState] = useState(null)
    const [jsonFile, setJsonFile] = useState(null)
    const [showImportDataMenu, setShowImportDataMenu] = useState(false)
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

    const toggleImportDataMenu = () => {
        setShowImportDataMenu(!showImportDataMenu)
    }

    const saveFile = async (key, file) => {
        try {
            setSaveState({
                status: 'pending'
            })
            const data = new FormData()
            data.append('file', file)
            const res = await callApi(saveFilesUrl, 'POST', data, true)
            const resData = await res.json()
            if(resData.status === 'error' || resData.status === 'fail')
                    throw resData.data
            if(!Array.isArray(formData[key])) {
                formData[key] = [
                    {
                        filename: resData.data.filename,
                        filepath: resData.data.url
                    }
                ]
            }
            else {
                formData[key].push({
                    filename: resData.data.filename,
                    filepath: resData.data.url
                })
            }
            await save()
        } catch (error) {
            const date = new Date()
            setSaveState({
                status: 'failed',
                time: date.toLocaleDateString() + " " + date.toLocaleTimeString(),
                error: error
            })
        }

    }

    const save = async () => {
        try {
            setSaveState({
                status: 'pending'
            })
            // const arrFiles = Object.entries(formData).filter(([key, val]) => val !== null && typeof val === 'object')
            // for(const [key, file] of arrFiles) {
            //     if(!(file instanceof File))
            //         continue
            //     const data = new FormData()
            //     data.append('file', file)
            //     const res = await callApi(saveFilesUrl, 'POST', data, true)
            //     const resData = await res.json()
            //     if(resData.status === 'error' || resData.status === 'fail')
            //         throw resData.data
            //     formData[key] = {
            //         filename: resData.data.filename,
            //         filepath: resData.data.url
            //     }
            // }
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
            const date = new Date()
            setSaveState({
                status: 'failed',
                time: date.toLocaleDateString() + " " + date.toLocaleTimeString(),
                error: error
            })
            // alert('บันทึกข้อมูลล้มเหลว\n' + error)
        }
    }

    const exportJson = async () => {
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(formData));
        var dlAnchorElem = document.createElement('a')
        dlAnchorElem.setAttribute("href",     dataStr     );
        dlAnchorElem.setAttribute("download", `${semesterTitle}.json`);
        dlAnchorElem.click();
    }
    
    const importData = () => {
        try {
            const reader = new FileReader()

            reader.onload = e => {
                const json = JSON.parse(e.target.result)
                const canBeImported = verifyImportedData(formTemplate, json)
                if(!canBeImported)
                    return alert('ไม่สามารถ Import ได้ เนื่องจาก format ข้อมูลและตารางไม่ตรงกัน')
                
                return setFormData(json)
            }

            reader.readAsText(jsonFile)
        } catch (error) {
            //console.log(error)
            alert('Import ฟอร์มล้มเหลว')
        }
        setShowImportDataMenu(false)
    }

    const ImportDataMenu = () => {
        return (
            <div className="backdrop">
                <div className="popup">
                    <button className="popup-close">
                        <GrFormClose onClick={() => setShowImportDataMenu(false)} size={30} color='rgb(240, 240, 240)' />
                    </button>
                    <div className="popup-input-container">
                        <label>ไฟล์ (.json)</label>
                        <input type="file" onChange={e => {
                            setJsonFile(e.target.files[0])
                        }}/>
                    </div>
                    <button onClick={importData} className="popup-button-edit margin-top-20px">Import</button>
                </div>
            </div>
        )
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
            {showImportDataMenu && ImportDataMenu()}
            <div className="button-bar" style={{justifyContent: 'space-between'}}>
                <div style={{display: 'flex'}}>
                    <button className="table-button" onClick={save}>Save</button>
                    <div style={{width: '20px'}}></div>
                    <button className="table-button" onClick={toggleImportDataMenu}>Import</button>
                </div>
                <div style={{display: 'flex'}}>
                    <button className="table-button" onClick={exportJson}>Export</button>
                    <div style={{width: '30px'}}></div>
                </div>
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
                                                        type="file" onChange={async e => {
                                                            if(e.target.files.length === 0)
                                                                return
                                                            setDataChanged(true)
                                                            await saveFile(cell.key, e.target.files[0])
                                                            e.target.value = ''
                                                        }} />
                                                        {(formData[cell.key] !== null && 
                                                            formData[cell.key] !== undefined && 
                                                            Array.isArray(formData[cell.key])) && 
                                                            formData[cell.key].map((fileInfo, index) => <label
                                                                className="download-filename"
                                                                onClick={async e => {
                                                                    const res = await callApi(`${process.env.REACT_APP_SERVER_URL}${fileInfo.filepath}`, 'GET')
                                                                    const file = await res.blob()
                                                                    var a = document.createElement("a");
                                                                    a.href = window.URL.createObjectURL(file);
                                                                    a.download = fileInfo.filename
                                                                    a.click();
                                                                }}
                                                                style={{
                                                                    fontWeight: 'bold',
                                                                    margin: '5px',
                                                                    cursor: 'pointer'
                                                                }}>{fileInfo.filename}
                                                                <div 
                                                                    className="file-delete"
                                                                    onClick={e => {
                                                                        e.stopPropagation()
                                                                        setDataChanged(true)
                                                                        setFormData(prev => {
                                                                            prev[cell.key].splice(index, 1)
                                                                            return {...prev}
                                                                        })
                                                                    }}
                                                                >
                                                                    <ImCross color="red" size={15}/>
                                                                </div>
                                                                </label>)}
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
import { useEffect, useState } from "react"
import callApi from "../../utils/callApi"

function FillUserForm(props) {
    const {formTemplate, setFormTemplate, formData, setFormData, semesterId, userId} = props
    const [selectedTable, setSelectedTable] = useState(0)



    if (formTemplate === null)
        return <div></div>

    const save = async () => {
        const res = await callApi(`${process.env.REACT_APP_SERVER_URL}/semester/${semesterId}/raw_data/${userId}/`, 'PUT', formData)
        const resData = await res.json()
        if(resData.status === 'success')
            return alert('บันทึกข้อมูลสำเร็จ')
            alert('บันทึกข้อมูลล้มเหลว')
    }

    const TableSelectBar = () => {
        const tableCount = formTemplate.length
        const activeStyle = {
            fontWeight: 'bold',
            textDecoration: 'underline'
        }
        return (
            <div className="table-select-bar">
                {Array.apply(null, Array(tableCount)).map((temp, index) => {
                    return (
                        <div className="table-select-bar-button-container">
                            <button style={selectedTable === index ? activeStyle : undefined} onClick={() => setSelectedTable(index)}>ตารางที่ {index + 1}</button>
                        </div>
                    )
                })}
            </div>
        )
    }

    const tableTemplate = formTemplate[selectedTable]

    return (
        <div className="content-container">
            <div className="button-bar">
                <button onClick={save}>save</button>
            </div>
            <TableSelectBar />
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
                                                    <textarea style={cell.textareaStyle} value={formData[cell.key] === null || formData[cell.key] === undefined ? startText : formData[cell.key]} onChange={e => {
                                                        setFormData(prev => {
                                                            if(e.target.value.length < startText.length)
                                                                e.target.value = startText
                                                            prev[cell.key] = e.target.value
                                                            return { ...prev }
                                                        })
                                                    }}></textarea>
                                                )
                                            }
                                            else if(inputType === 'number') {
                                                TableContent = (
                                                    <input style={cell.textareaStyle} type="number" value={formData[cell.key] === null || formData[cell.key] === undefined ? '' : formData[cell.key]} onChange={e => {
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
                                                        <input style={cell.textareaStyle} type="checkbox" checked={formData[cell.key] === null || formData[cell.key] === undefined ? false : formData[cell.key]} onChange={e => {
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
                                            TableContent = (<textarea style={cell.textareaStyle} disabled={true} value={cell.value} ></textarea>)
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
import { useEffect, useState } from "react"

function FillUserForm(props) {
    const [formTemplate, setFormTemplate] = useState(null)
    const [formData, setFormData] = useState({})
    const [selectedTable, setSelectedTable] = useState(0)

    const loadTemplate = async () => {
        const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/user-form-template`, {
            method: 'GET',
        })
        setFormTemplate(await res.json())
    }

    const save = async () => {
        const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/user-data`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        alert("Save Success")
    }

    const load = async () => {
        const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/user-data`, {
            method: 'GET',
        })
        setFormData(await res.json())
        alert("Load Success")
    }

    useEffect(() => {
        loadTemplate()
    }, [])

    if (formTemplate === null)
        return <div></div>

    const TableSelectBar = () => {
        const tableCount = formTemplate.length
        return (
            <div className="table-select-bar">
                {Array.apply(null, Array(tableCount)).map((temp, index) => {
                    return (
                        <div className="table-select-bar-button-container">
                            <button onClick={() => setSelectedTable(index)}>ตารางที่ {index + 1}</button>
                        </div>
                    )
                })}
            </div>
        )
    }

    const tableTemplate = formTemplate[selectedTable]
    console.log(tableTemplate)

    return (
        <div className="content-container">
            <div className="float-button-bar">
                <button onClick={save}>Save</button>
                <button onClick={load}>Load</button>
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
                                                TableContent = (
                                                    <textarea value={formData[cell.key] === undefined ? startText : formData[cell.key]} onChange={e => {
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
                                                    <input type="number" value={formData[cell.key] === undefined ? '' : formData[cell.key]} onChange={e => {
                                                        setFormData(prev => {
                                                            prev[cell.key] = e.target.value
                                                            return { ...prev }
                                                        })
                                                    }}/>
                                                )
                                            }
                                            else if(inputType === 'checkbox') {
                                                TableContent = (
                                                    <input type="checkbox" checked={formData[cell.key] === undefined || formData[cell.key] === null ? false : formData[cell.key]} onChange={e => {
                                                        setFormData(prev => {
                                                            prev[cell.key] = e.target.checked
                                                            return {...prev}
                                                        })
                                                    }} />
                                                )
                                            }
                                        }
                                        //is comment
                                        else {
                                            TableContent = (<textarea disabled={true} value={cell.value} ></textarea>)
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
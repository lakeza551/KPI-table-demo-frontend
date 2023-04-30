import { useEffect, useState } from "react"

function FillUserForm(props) {
    const [tableTemplate, setTableTemplate] = useState(null)
    const [tableData, setTableData] = useState({})

    const loadTemplate = async () => {
        const res = await fetch('http://localhost:3001/user-form-template', {
            method: 'GET',
        })
        setTableTemplate(await res.json())
    }

    const save = async () => {
        const res = await fetch('http://localhost:3001/user-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tableData)
        })
        alert("Save Success")
    }

    const load = async () => {
        const res = await fetch('http://localhost:3001/user-data', {
            method: 'GET',
        })
        setTableData(await res.json())
        alert("Load Success")
    }

    useEffect(() => {
        loadTemplate()
    }, [])

    if(tableTemplate === null)
        return <div></div>

    return (
        <div>
            <div className="float-button-bar">
                <button onClick={save}>Save</button>
                <button onClick={load}>Load</button>
            </div>
            <div className="table-container">
                <table>
                    <tbody>
                        {tableTemplate.rows.map((row, rIndex) => {
                            return (
                                <tr style={{ height: tableTemplate.rowHeight[rIndex] }}>
                                    {row.columns.map((cell, cIndex) => {
                                        if(cell.isMerged)
                                            return
                                        var TableContent
                                        if(cell.type === 'input') {
                                            TableContent = (<textarea value={tableData[cell.key] === undefined ? '' : tableData[cell.key]} onChange={e => {
                                                setTableData(prev => {
                                                    prev[cell.key] = e.target.value
                                                    return {...prev}
                                                })
                                            }}></textarea>)
                                        }
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
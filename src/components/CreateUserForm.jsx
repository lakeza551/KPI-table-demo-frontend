import { useState } from "react"

function CreateUserForm(props) {
    const defaultRowHeight = 175
    const defaultColumnWidth = 225
    const [selectedCell, setSelectedCell] = useState(null)
    const [table, setTable] = useState({
        rowHeight: [defaultRowHeight],
        columnWidth: [defaultColumnWidth],
        rows: [
            {
                columns: [
                    {
                        key: '#a1_r0_c0',
                        rowSpan: 1,
                        colSpan: 1,
                        value: null,
                        isMerged: false
                    }
                ]
            }
        ]
    })

    const addRow = (direction, rIndex, cIndex) => {
        setTable(prev => {
            var top
            var bottom
            if (direction === 'top') {
                top = prev.rows.slice(0, rIndex)
                bottom = prev.rows.slice(rIndex, prev.length)
                prev.rowHeight = [
                    ...prev.rowHeight.slice(0, rIndex),
                    defaultRowHeight,
                    ...prev.rowHeight.slice(rIndex, prev.length)
                ]
            }
            else if (direction === 'bottom') {
                top = prev.rows.slice(0, rIndex + 1)
                bottom = prev.rows.slice(rIndex + 1, prev.length)
                prev.rowHeight = [
                    ...prev.rowHeight.slice(0, rIndex + 1),
                    defaultRowHeight,
                    ...prev.rowHeight.slice(rIndex + 1, prev.length)
                ]
            }
            const newRow = {
                columns: table.rows[rIndex].columns.map(cell => ({
                    colSpan: 1,
                    rowSpan: 1,
                    value: null,
                    isMerged: false
                }))
            }
            prev.rows = [...top, newRow, ...bottom]
            return { ...prev }
        })
        generateKeys()
    }

    const addColumn = (direction, rIndex, cIndex) => {
        setTable(prev => {
            var left
            var right
            if (direction === 'left') {
                left = prev.rows[rIndex].columns.slice(0, cIndex)
                right = prev.rows[rIndex].columns.slice(cIndex, prev.rows[rIndex].columns.length)
                prev.columnWidth = [
                    ...prev.columnWidth.slice(0, cIndex),
                    defaultColumnWidth,
                    ...prev.columnWidth.slice(cIndex, prev.rows[rIndex].columns.length)
                ]
            }
            else if (direction === 'right') {
                left = prev.rows[rIndex].columns.slice(0, cIndex + 1)
                right = prev.rows[rIndex].columns.slice(cIndex + 1, prev.rows[rIndex].columns.length)
                prev.columnWidth = [
                    ...prev.columnWidth.slice(0, cIndex + 1),
                    defaultColumnWidth,
                    ...prev.columnWidth.slice(cIndex + 1, prev.rows[rIndex].columns.length)
                ]
            }
            //console.log(prev.columnWidth)
            const newCell = {
                colSpan: 1,
                rowSpan: 1,
                value: null,
                isMerged: false
            }
            prev.rows[rIndex].columns = [...left, newCell, ...right]
            return { ...prev }
        })
        generateKeys()
    }

    const spanColumn = (rIndex, cIndex) => {
        setTable(prev => {
            const cell = prev.rows[rIndex].columns[cIndex]
            var lengths = prev.rows.map(r => r.columns.length)
            //console.log(lengths)
            if (cell.colSpan < Math.max(...lengths)) {
                cell.colSpan += 1
                for (var currentRow = rIndex; currentRow < cell.rowSpan + rIndex; ++currentRow) {
                    prev.rows[currentRow].columns[cIndex + cell.colSpan - 1].isMerged = true
                }
            }
            return { ...prev }
        })
        generateKeys()
    }

    const spanRow = (rIndex, cIndex) => {
        setTable(prev => {
            const cell = prev.rows[rIndex].columns[cIndex]
            if (cell.rowSpan < prev.rows.length) {
                cell.rowSpan += 1
                for (var currentColumn = cIndex; currentColumn < cell.colSpan + cIndex; ++currentColumn) {
                    prev.rows[rIndex + cell.rowSpan - 1].columns[currentColumn].isMerged = true
                }
            }
            return { ...prev }
        })
        generateKeys()
    }

    const changeHeight = (rIndex, size) => {
        setTable(prev => {
            prev.rowHeight[rIndex] += size
            return {...prev}
        })
    }

    const changeWidth = (cIndex, size) => {
        setTable(prev => {
            prev.columnWidth[cIndex] += size
            return {...prev}
        })
    }

    const Toolbox = ({ rIndex, cIndex }) => {
        return (
            <div className="toolbox">
                <button onClick={() => spanColumn(rIndex, cIndex)}>
                    span column
                </button>
                <button onClick={() => spanRow(rIndex, cIndex)}>
                    span row
                </button>
                <button onClick={() => addColumn('left', rIndex, cIndex)}>
                    add left column
                </button>
                <button onClick={() => addColumn('right', rIndex, cIndex)}>
                    add right column
                </button>
                <button onClick={() => addRow('top', rIndex, cIndex)}>
                    add top row
                </button>
                <button onClick={() => addRow('bottom', rIndex, cIndex)}>
                    add bottom row
                </button>
                <button onClick={() => changeHeight(rIndex, 25)}>
                    increase height
                </button>
                <button onClick={() => changeWidth(cIndex, 25)}>
                    increase width
                </button>
                <button onClick={() => changeHeight(rIndex, -25)}>
                    decrease height
                </button>
                <button onClick={() => changeWidth(cIndex, -25)}>
                    decrease width
                </button>
            </div>
        )
    }

    const generateKeys = () => {
        setTable(prev => {
            prev.rows.forEach((row, rIndex) => {
                row.columns.forEach((cell, cIndex) => {
                    cell.key = `#a1_r${rIndex}_c${cIndex}`
                    if (cell.value === 'value') {
                        cell.type = 'input'
                        cell.value = null
                    }
                    else
                        cell.type = 'comment'
                })
            })
            return { ...prev }
        })
    }

    const load = async () => {
        const res = await fetch('http://localhost:3001/user-form-template', {
            method: 'GET',
        })
        setTable(await res.json())
        alert("Load Success")
    }

    const save = async () => {
        const res = await fetch('http://localhost:3001/user-form-template', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(table)
        })
        console.log(res)
        alert("Save Success")
    }


    return (
        <div>
            <div className="float-button-bar">
                <button onClick={generateKeys}>Compile table</button>
                <button onClick={load}>Load</button>
                <button onClick={save}>Save</button>
            </div>
            <div className="table-container">
                <table>
                    <tbody>
                        {table.rows.map((row, rIndex) => {
                            return (
                                <tr style={{ height: table.rowHeight[rIndex] }}>
                                    {row.columns.map((cell, cIndex) => {
                                        if(cell.isMerged)
                                            return
                                        return (
                                            <td colSpan={cell.colSpan} rowSpan={cell.rowSpan} style={{ width: table.columnWidth[cIndex], height: table.rowHeight[rIndex] }}>
                                                <Toolbox rIndex={rIndex} cIndex={cIndex} />
                                                <label style={{
                                                    color: cell.type === 'input' ? 'red' : 'black'
                                                }} className="cell-key">{cell.key ? cell.key : ''}</label>
                                                <textarea
                                                onBlur={() => setSelectedCell(null)} 
                                                onFocus={() => setSelectedCell({
                                                    rIndex: rIndex,
                                                    cIndex: cIndex
                                                })} 
                                                value={cell.value === null ? '' : cell.value} 
                                                onChange={e => {
                                                    setTable(prev => {
                                                        cell.value = e.target.value
                                                        return { ...prev }
                                                    })
                                                }}></textarea>
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

export default CreateUserForm
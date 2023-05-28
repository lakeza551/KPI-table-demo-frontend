import { useEffect, useState } from "react"
import { CreateFormUtils } from '../../utils/createFormUtils'
import DashboardCellToolbox from "../fractions/DashboardCellToolbox"
import callApi from "../../utils/callApi"
import userData2SummaryData from "../../utils/userData2SummaryData"
import { BeatLoader } from "react-spinners"

function ViewDashboardForm(props) {
    const [selectedTable, setSelectedTable] = useState(0)
    const { summaryFormTemplate, dashboardFormTemplate, rawDataList, departmentList } = props
    const [dashboardData, setDashboardData] = useState({})

    const createDashboardData = async () => {
        const departmentRow = dashboardFormTemplate[0].rows.filter(row => row.columns[0].value !== null && row.columns[0].value.startsWith('!department'))
        for (const row of departmentRow) {
            const departmentId = Number(row.columns[0].value.split('#')[1])
            const rawData = rawDataList[departmentId]
            var summaryData = []
            for (const data of rawData) {
                summaryData.push(userData2SummaryData(summaryFormTemplate, data.raw_data))
            }

            for (const cell of row.columns.slice(1)) {
                const summaryKey = cell.value.substring(1)
                const avg = summaryData.reduce((total, a) => total + a[summaryKey], 0) / summaryData.length
                setDashboardData(prev => {
                    prev[cell.key] = isNaN(avg) ? '' : avg
                    return { ...prev }
                })
            }
        }
    }

    useEffect(() => {
        if (summaryFormTemplate === null || dashboardFormTemplate === null) {
            setDashboardData({})
            return
        }
        createDashboardData()
    }, [rawDataList, summaryFormTemplate, dashboardFormTemplate])



    if (rawDataList === null || summaryFormTemplate === null || dashboardFormTemplate === null)
        return (
            <h2>ยังไม่มีการสร้าง Dashboard</h2>
        )

    if (Object.keys(dashboardData).length === 0) {
        return (
            <div className="center">
                <BeatLoader size={40} color="rgb(0, 87, 181)" />
            </div>
        )
    }
    const table = dashboardFormTemplate[0]
    return (
        <div>
            <div className="table-container">
                <table>
                    <tbody>
                        {table.rows.map((row, rIndex) => {
                            return (
                                <tr style={{ height: table.rowHeight[rIndex] }}>
                                    {row.columns.map((cell, cIndex) => {
                                        if (cell.isMerged)
                                            return
                                        if (cell.value !== null && cell.value.startsWith('!department')) {
                                            const departmentId = Number(cell.value.split('#')[1])
                                            const departmentName = departmentList.filter(dep => dep.id === departmentId)[0].title
                                            return (
                                                <td
                                                    colSpan={cell.colSpan}
                                                    rowSpan={cell.rowSpan}
                                                    style={{
                                                        width: table.columnWidth[cIndex],
                                                        height: table.rowHeight[rIndex],
                                                        ...cell.style
                                                    }}>
                                                    <label style={{
                                                        color: cell.type === 'input' ? 'red' : 'black'
                                                    }} className="cell-key">{cell.key ? cell.key : ''}</label>
                                                    <textarea
                                                        style={cell.textareaStyle}
                                                        value={departmentName}
                                                        disabled
                                                    ></textarea>
                                                    <label className="cell-key">{cell.key}</label>
                                                </td>
                                            )
                                        }

                                        if (cell.value !== null && cell.value.startsWith('='))
                                            return (
                                                <td
                                                    colSpan={cell.colSpan}
                                                    rowSpan={cell.rowSpan}
                                                    style={{
                                                        width: table.columnWidth[cIndex],
                                                        height: table.rowHeight[rIndex],
                                                        ...cell.style
                                                    }}>
                                                    <label style={{
                                                        color: cell.type === 'input' ? 'red' : 'black'
                                                    }} className="cell-key">{cell.key ? cell.key : ''}</label>
                                                    <textarea
                                                        style={cell.textareaStyle}
                                                        value={dashboardData[cell.key]}
                                                        disabled
                                                    ></textarea>
                                                    <label className="cell-key">{cell.key}</label>
                                                </td>
                                            )
                                        return (
                                            <td
                                                colSpan={cell.colSpan}
                                                rowSpan={cell.rowSpan}
                                                style={{
                                                    width: table.columnWidth[cIndex],
                                                    height: table.rowHeight[rIndex],
                                                    ...cell.style
                                                }}>
                                                <label style={{
                                                    color: cell.type === 'input' ? 'red' : 'black'
                                                }} className="cell-key">{cell.key ? cell.key : ''}</label>
                                                <textarea
                                                    style={cell.textareaStyle}
                                                    value={cell.value === null ? '' : cell.value}
                                                    disabled
                                                ></textarea>
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

export default ViewDashboardForm
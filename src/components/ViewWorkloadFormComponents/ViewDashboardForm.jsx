import { useEffect, useState } from "react"
import { Chart } from 'react-google-charts'
import { columnNameList } from "../../utils/createCellKey"
import userData2SummaryData from "../../utils/userData2SummaryData"
import { BeatLoader } from "react-spinners"

function ViewDashboardForm(props) {
    const [selectedTable, setSelectedTable] = useState('table')
    const { summaryFormTemplate, dashboardFormTemplate, rawDataList, departmentList, selectedSemester } = props
    const [dashboardData, setDashboardData] = useState(null)
    const [dashboardSummaryData, setDashboardSummaryData] = useState(null)
    var dashboardDataBuffer = {}

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
                const avg = summaryData.reduce((total, a) => total + Number(a[summaryKey]), 0) / summaryData.length
                dashboardDataBuffer[cell.key] = avg
            }
        }
    }

    const createSummaryDashboardData = () => {
        const topicRow = dashboardFormTemplate[0].rows.filter(row => row.columns[0].value !== null && row.columns[0].value.startsWith('!topic'))[0]
        const summaryRow = dashboardFormTemplate[0].rows.filter(row => row.columns[0].value !== null && row.columns[0].value.startsWith('!summary'))[0]
        if(topicRow === undefined || summaryRow === undefined)
            return
        const dashboardSummaryBuffer = []
        for (const summaryCell of summaryRow.columns.slice(1)) {
            const columnIndex = summaryCell.key.split('_')[1].charAt(0)
            const rowIndex = Number(summaryCell.key.split('_')[1].substring(1))
            var sum = 0
            for (var i = 2; i < rowIndex; ++i) {
                sum += dashboardDataBuffer[`#c1_${columnIndex}${i}`]
            }
            dashboardDataBuffer[`#c1_${columnIndex}${rowIndex}`] = sum
            const columnIndexNumber = columnNameList.indexOf(columnIndex)
            dashboardSummaryBuffer.push([topicRow.columns[columnIndexNumber].value, sum])
        }
        setDashboardData(dashboardDataBuffer)
        setDashboardSummaryData(dashboardSummaryBuffer)
    }

    useEffect(() => {
        if (summaryFormTemplate === null || dashboardFormTemplate === null || rawDataList === null) {
            setDashboardData(null)
            return
        }
        createDashboardData()
        createSummaryDashboardData()
    }, [rawDataList, summaryFormTemplate, dashboardFormTemplate])

    useEffect(() => {
        setDashboardData(null)
        setDashboardSummaryData(null)
    }, [selectedSemester])

    if (rawDataList === null || summaryFormTemplate === null || dashboardFormTemplate === null)
        return (
            <h2>ยังไม่มีการสร้าง Dashboard</h2>
        )

    if (dashboardData === null && dashboardSummaryData === null) {
        return (
            <div className="center">
                <BeatLoader size={40} color="rgb(0, 87, 181)" />
            </div>
        )
    }
    //createSummaryDashboardData()
    const table = dashboardFormTemplate[0]

    const TableSelectBar = () => {
        const activeStyle = {
            fontWeight: 'bold',
            textDecoration: 'underline'
        }
        return (
            <div className="table-select-bar" style={{ marginTop: '20px' }}>
                <button style={selectedTable === 'table' ? activeStyle : undefined} onClick={() => setSelectedTable('table')}>ตาราง</button>
                <button style={selectedTable === 'chart' ? activeStyle : undefined} onClick={() => setSelectedTable('chart')}>กราฟ</button>
            </div>
        )
    }

    const Table = () => {
        return <div className="table-container">
            <table>
                <tbody>
                    {table.rows.map((row, rIndex) => {
                        return (
                            <tr style={{ height: table.rowHeight[rIndex] }}>
                                {row.columns.map((cell, cIndex) => {
                                    if (cell.isMerged)
                                        return
                                    if (cell.value !== null && cell.value.startsWith('!summary')) {
                                        return (
                                            <td
                                                colSpan={cell.colSpan}
                                                rowSpan={cell.rowSpan}
                                                style={{
                                                    width: table.columnWidth[cIndex],
                                                    height: table.rowHeight[rIndex],
                                                    ...cell.style
                                                }}>
                                                <textarea
                                                    style={cell.textareaStyle}
                                                    value='สรุป'
                                                    disabled
                                                ></textarea>
                                            </td>
                                        )
                                    }
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
                                                <textarea
                                                    style={cell.textareaStyle}
                                                    value={departmentName}
                                                    disabled
                                                ></textarea>
                                            </td>
                                        )
                                    }

                                    if (cell.value !== null && cell.value.startsWith('=') || row.columns[0].value.startsWith('!summary'))
                                        return (
                                            <td
                                                colSpan={cell.colSpan}
                                                rowSpan={cell.rowSpan}
                                                style={{
                                                    width: table.columnWidth[cIndex],
                                                    height: table.rowHeight[rIndex],
                                                    ...cell.style
                                                }}>
                                                <textarea
                                                    style={cell.textareaStyle}
                                                    value={dashboardData[cell.key]}
                                                    disabled
                                                ></textarea>
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
                                            
                                            <textarea
                                                style={cell.textareaStyle}
                                                value={cell.value === null || cell.value === '!topic' ? '' : cell.value}
                                                disabled
                                            ></textarea>
                                        </td>
                                    )
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    }

    const PieChart = () => {
        return (
            <Chart
                chartType='PieChart'
                data={[
                    ['ภาระงาน', 'คะแนน'],
                    ...dashboardSummaryData
                ]}
                options={{
                    title: 'กราฟ',
                    legend: {
                        alignment: 'center',
                        position: 'top'
                    }
                }}
                width={'100%'}
                height={'800px'}
            />
        )
    }

    return (
        <div>
            <TableSelectBar />
            {selectedTable === 'table' && Table()}
            {selectedTable === 'chart' && PieChart()}

        </div>
    )
}

export default ViewDashboardForm
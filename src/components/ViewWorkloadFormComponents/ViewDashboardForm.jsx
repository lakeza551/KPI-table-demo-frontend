import { useEffect, useState } from "react"
import { Chart } from 'react-google-charts'
import userData2SummaryData from "../../utils/userData2SummaryData"
import Select from 'react-select'
import Cookies from 'universal-cookie'
import { isNumber, isNumeric } from "mathjs"

function ViewDashboardForm(props) {
    const cookies = new Cookies()
    const workloadCookie = cookies.get(process.env.REACT_APP_COOKIE_NAME_TOKEN)
    const {userInfo} = workloadCookie
    const [selectedTable, setSelectedTable] = useState('table')
    const { summaryFormTemplate, dashboardFormTemplate, rawDataList, departmentList, selectedSemester } = props
    const [dashboardData, setDashboardData] = useState(null)
    const [dashboardSummaryData, setDashboardSummaryData] = useState(null)
    const [filter, setFilter] = useState(userInfo.is_admin ? null : 'department')
    const [selectedDepartment, setSelectedDepartment] = useState(userInfo.is_admin ? null : userInfo.groups[0].id)

    const createDashboardDataFaculty = async () => {
        const templateClone = JSON.parse(JSON.stringify(dashboardFormTemplate[0]))
        const headerRow = templateClone.rows[0]
        const dataRow = templateClone.rows[1]
        for (const dep of departmentList) {
            const rawData = rawDataList[dep.id]
            const summaryData = []
            for (const data of rawData) {
                summaryData.push(userData2SummaryData(summaryFormTemplate, data.raw_data))
            }
            const newRow = {
                columns: dataRow.columns.map(cell => {
                    const avg = summaryData.reduce((total, a) => {
                        return total + Number(a[cell.value.substring(1)])
                    }, 0) / summaryData.length
                    return {
                        value: isNaN(avg) ? 0 : avg.toFixed(2)
                    }
                })
            }
            newRow.columns.unshift({
                value: dep.title
            })
            templateClone.rows.push(newRow)
        }
        headerRow.columns.unshift({
            value: ''
        })
        templateClone.rows.splice(1, 1)
        const summationRow = {
            columns: headerRow.columns.map((cell, cIndex) => {
                if (cell.value === '')
                    return {
                        value: 'รวม'
                    }
                const sum = templateClone.rows.slice(1).reduce((sum, row) => {
                    return sum + Number(row.columns[cIndex].value)
                }, 0)

                return {
                    value: sum.toFixed(2)
                }
            })
        }
        const averageRow = {
            columns: headerRow.columns.map((cell, cIndex) => {
                if (cell.value === '')
                    return {
                        value: 'เฉลี่ย'
                    }
                const sum = templateClone.rows.slice(1).reduce((sum, row) => {
                    return sum + Number(row.columns[cIndex].value)
                }, 0) / departmentList.length

                return {
                    value: sum.toFixed(2)
                }
            })
        }
        templateClone.rows.push(summationRow)
        templateClone.rows.push(averageRow)
        setDashboardData(templateClone)
    }

    const createDashboardDataDepartment = async () => {
        const templateClone = JSON.parse(JSON.stringify(dashboardFormTemplate[0]))
        const headerRow = templateClone.rows[0]
        const dataRow = templateClone.rows[1]
        for(const obj of rawDataList[selectedDepartment]) {
            const summaryData = userData2SummaryData(summaryFormTemplate, obj.raw_data)
            const newRow = {
                columns: dataRow.columns.map(cell => {
                    return {
                        // value: summaryData[cell.value.substring(1)] === null || summaryData[cell.value.substring(1)] === undefined ? 0.00 : summaryData[cell.value.substring(1)]
                        value:  isNumber(Number(summaryData[cell.value.substring(1)])) ? Number(summaryData[cell.value.substring(1)]).toFixed(2) : 0.00
                    }
                })
            }
            newRow.columns.unshift({
                value: obj.user.name
            })
            templateClone.rows.push(newRow)
        }
        headerRow.columns.unshift({
            value: departmentList.filter(dep => dep.id === selectedDepartment)[0].title
        })
        templateClone.rows.splice(1, 1)
        const summationRow = {
            columns: headerRow.columns.map((cell, cIndex) => {
                if (cell.value === '' || cell.value.startsWith('ภาควิชา'))
                    return {
                        value: 'รวม'
                    }
                const sum = templateClone.rows.slice(1).reduce((sum, row) => {
                    return sum + Number(row.columns[cIndex].value)
                }, 0)

                return {
                    value: sum.toFixed(2)
                }
            })
        }
        const averageRow = {
            columns: headerRow.columns.map((cell, cIndex) => {
                if (cell.value === '' || cell.value.startsWith('ภาควิชา'))
                    return {
                        value: 'เฉลี่ย'
                    }
                const sum = templateClone.rows.slice(1).reduce((sum, row) => {
                    return sum + Number(row.columns[cIndex].value)
                }, 0) / rawDataList[selectedDepartment].length

                return {
                    value: sum.toFixed(2)
                }
            })
        }
        templateClone.rows.push(summationRow)
        templateClone.rows.push(averageRow)
        setDashboardData(templateClone)
        return
    }

    useEffect(() => {
        if (summaryFormTemplate === null || dashboardFormTemplate === null || rawDataList === null) {
            setDashboardData(null)
            return
        }
        if(filter === 'faculty') {
            setSelectedDepartment(null)
            createDashboardDataFaculty()
        }
        if(filter === 'department' && selectedDepartment !== null) {
            createDashboardDataDepartment()
        }
    }, [rawDataList, summaryFormTemplate, dashboardFormTemplate, filter, selectedDepartment])

    useEffect(() => {
        userInfo.is_admin && setFilter(null)
        setDashboardData(null)
        setDashboardSummaryData(null)
    }, [selectedSemester])


    if (rawDataList === null || summaryFormTemplate === null || dashboardFormTemplate === null)
        return (
            <h2>ยังไม่มีการสร้าง Dashboard</h2>
        )
    const table = dashboardData

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
                            <tr>
                                {row.columns.map((cell, cIndex) => {
                                    return <td style={{
                                        padding: '3px 5px',
                                        width: cIndex === 0 ? 'fit-content' : table.columnWidth[cIndex - 1],
                                        textAlign: rIndex === 0 || rIndex >= table.rows.length - 2 || cIndex > 0 ? 'center' : 'left'
                                    }}>{cell.value}</td>
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
                    ...table.rows[0].columns.map((cell, cIndex) => {
                        return [cell.value, Number(table.rows[table.rows.length - 2].columns[cIndex].value)]
                    })
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
            <div className="dashboard-filter-container" style={{
                marginTop: '30px',
                display: 'flex'
            }}>
                <div className="dashboard-filter" style={{
                    width: '300px'
                }}>
                    <Select
                        styles={{
                            width: '100px'
                        }}
                        placeholder='-- ระบุขอบเขต --'
                        onChange={selected => setFilter(selected.value)}
                        isDisabled={userInfo.is_admin ?  false : true}
                        value={userInfo.is_admin ? undefined : {
                            label: 'ภาควิชา',
                            value: 'department'
                        }}
                        options={userInfo.is_admin ? [
                            {
                                label: 'คณะ',
                                value: 'faculty'
                            },
                            {
                                label: 'ภาควิชา',
                                value: 'department'
                            }
                        ] : undefined}
                    >
                    </Select>
                </div>
                {filter === 'department' && <div className="dashboard-filter" style={{
                    width: '300px',
                    marginLeft: '30px'
                }}>
                    <Select
                        placeholder='-- ระบุภาควิชา --'
                        styles={{
                            width: '100px'
                        }}
                        onChange={selected => setSelectedDepartment(selected.value)}
                        isDisabled={userInfo.is_admin ?  false : true}
                        value={userInfo.is_admin ? undefined : {
                            label: userInfo.groups[0].title,
                            value: userInfo.groups[0].id
                        }}
                        options={userInfo.is_admin ? departmentList.map(dep => {
                            return {
                                value: dep.id,
                                label: dep.title
                            }
                        }) : undefined}
                    >
                    </Select>
                </div>}
            </div>
            <TableSelectBar />
            {dashboardData !== null && selectedTable === 'table' && Table()}
            {dashboardData !== null && selectedTable === 'chart' && PieChart()}
        </div>
    )
}

export default ViewDashboardForm
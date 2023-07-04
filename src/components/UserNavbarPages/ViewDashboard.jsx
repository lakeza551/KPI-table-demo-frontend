import Select from "react-select"
import fetchSemesterList from "../../utils/fetchSemesterList"
import ViewDashboardForm from "../ViewWorkloadFormComponents/ViewDashboardForm"
import { useEffect, useState } from "react"
import callApi from "../../utils/callApi"
import fetchRawDataAllDeparment from "../../utils/fetchRawDataAllDeparment"
import fetchDepartmentList from "../../utils/fetchDepartmentList"

function ViewDashboard(props) {
    const [semesterList, setSemesterList] = useState([])
    const [selectedSemester, setSelectedSemester] = useState(null)
    const [dashboardFormTemplate, setDashboardFormTemplate] = useState(null)
    const [summaryFormTemplate, setSummaryFormTemplate] = useState(null)
    const [departmentList, setDepartmentList] = useState(null)
    const [rawDataList, setRawDataList] = useState(null)

    const fetchDashboardFormTemplate = async () => {
        const res = await callApi(`${process.env.REACT_APP_SERVER_URL}/semester/${selectedSemester}/dashboard/`, 'GET', 'null')
        const template = (await res.json()).data
        if(Object.keys(template).length === 0)
            setDashboardFormTemplate(null)
        else
            setDashboardFormTemplate(template)
    }

    const fetchSummaryFormTemplate = async () => {
        const res = await callApi(`${process.env.REACT_APP_SERVER_URL}/semester/${selectedSemester}/summary/`, 'GET', 'null')
        const template = (await res.json()).data
        if(Object.keys(template).length === 0)
            setSummaryFormTemplate(null)
        else
            setSummaryFormTemplate(template)
    }

    useEffect(() => {
        fetchSemesterList(setSemesterList)
        fetchDepartmentList(setDepartmentList)
    }, [])

    useEffect(() => {
        setDashboardFormTemplate(null)
        setRawDataList(null)
        setSummaryFormTemplate(null)
        if(selectedSemester === null)
            return
        fetchDashboardFormTemplate()
        fetchSummaryFormTemplate()
        fetchRawDataAllDeparment(selectedSemester, setRawDataList)
    }, [selectedSemester])

    
    //console.log(rawDataList)
    return (
        <div className="page-content-container">
            <Select
                className="custom-react-select"
                placeholder="-- โปรดระบุเทอม --"
                onChange={selected => {
                    setSelectedSemester(selected.value)
                }}
                options={semesterList.map(semester => {
                    return {
                        value: semester.id,
                        label: semester.title
                    }
                })}></Select>
            {selectedSemester !== null && 
            <ViewDashboardForm 
            dashboardFormTemplate={dashboardFormTemplate}
            setDashboardFormTemplate={setDashboardFormTemplate} 
            summaryFormTemplate={summaryFormTemplate} 
            rawDataList={rawDataList} 
            departmentList={departmentList} 
            selectedSemester={selectedSemester}/>}
        </div>
    )
}

export default ViewDashboard
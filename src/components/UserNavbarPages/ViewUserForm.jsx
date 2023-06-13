import { useEffect, useState } from "react"
import { Routes, Route, Link, useSearchParams } from "react-router-dom"
import ViewSummaryForm from "../ViewUserFormComponents/ViewSummaryForm"
import FillUserForm from "../ViewUserFormComponents/FillUserForm"
import callApi from "../../utils/callApi"
import Select from "react-select"
import Cookies from "universal-cookie"

function ViewUserForm() {
    const [searchParams, setSearchParams] = useSearchParams({})
    const [semesterList, setSemesterList] = useState(null)
    const [selectedSemester, setSelectedSemester] = useState(null)
    const [departmentList, setDepartmentList] = useState(null)
    const [userList, setUserList] = useState(null)
    const [filteredUserList, setFilteredUserList] = useState([])

    const [selectedUser, setSelectedUser] = useState(null)

    const [userRawData, setUserRawData] = useState(null)
    const [userFormTemplate, setUserFormTemplate] = useState(null)
    const [summaryFormTemplate, setSummaryFormTemplate] = useState(null)

    const cookies = new Cookies()
    const {userInfo} = cookies.get(process.env.REACT_APP_COOKIE_NAME_TOKEN)

    const fetchDepartmentList = async () => {
        const res = await callApi(`${process.env.REACT_APP_SERVER_URL}/group/`, 'GET', null)
        const resData = await res.json()
        setDepartmentList(resData.data)
    }

    const fetchSemesterList = async () => {
        const res = await callApi(`${process.env.REACT_APP_SERVER_URL}/semester/`, 'GET', null)
        const resData = await res.json()
        resData.data.reverse()
        setSemesterList(resData.data)
    }

    const fetchUserList = async () => {
        const res = await callApi(`${process.env.REACT_APP_SERVER_URL}/user/`, 'GET', null)
        const resData = await res.json()
        setUserList(resData.data)
    }

    const filterUserListByDepartmentID = async depId => {
        const filtered = userList.filter(user => user.groups.length > 0 && user.groups[0].id === depId)
        setFilteredUserList(filtered)
    }

    const fetchForm = async () => {
        var res, resData
        //raw data
        res = await callApi(`${process.env.REACT_APP_SERVER_URL}/semester/${selectedSemester}/raw_data/me/`, 'GET', null)
        resData = await res.json()
        const rawDataObj = resData


        //user form template
        res = await callApi(`${process.env.REACT_APP_SERVER_URL}/semester/${selectedSemester}/form/`, 'GET', null)
        resData = await res.json()
        const formTemplate = resData.data

        //summary form template
        res = await callApi(`${process.env.REACT_APP_SERVER_URL}/semester/${selectedSemester}/summary/`, 'GET', null)
        resData = await res.json()
        const summaryFormTemplate = resData.data

        var rawData
        if (rawDataObj.status === 'fail') {
            rawData = await initiateRawDataIfNotFound(formTemplate)
        }
        else
            rawData = rawDataObj.data

        setUserRawData(rawData)
        setUserFormTemplate(formTemplate)
        setSummaryFormTemplate(summaryFormTemplate)
    }

    const saveInitiateData = async (rawData) => {
        var res, resData
        //raw data
        res = await callApi(`${process.env.REACT_APP_SERVER_URL}/semester/${selectedSemester}/raw_data/me/`, 'PUT', rawData)
        resData = await res.json()
    }

    const initiateRawDataIfNotFound = async formTemplate => {
        console.log(formTemplate)
        const rawData = {}
        for (const table of formTemplate) {
            for (const row of table.rows) {
                for (const cell of row.columns) {
                    if (cell.type.startsWith('input'))
                        rawData[cell.key] = null
                }
            }
        }
        await saveInitiateData(rawData)
        return rawData
    }

    const FormSelectButtonBar = () => {
        const formActiveStyle = {
            backgroundColor: 'rgb(0, 87, 181)',
            color: 'white'
        }
        return (
            <div className="form-select">
                <Link to='./fill' style={window.location.pathname.endsWith('fill') ? formActiveStyle : undefined} >ฟอร์ม Work load</Link>
                <Link to='./summary' style={window.location.pathname.endsWith('summary') ? formActiveStyle : undefined} >ฟอร์มสรุป</Link>
            </div>
        )
    }

    const save = async () => {
        const res = await callApi(`${process.env.REACT_APP_SERVER_URL}/semester/${selectedSemester}/raw_data/me/`, 'PUT', userRawData)
        const resData = await res.json()
        if(resData.status === 'success')
            return alert('บันทึกข้อมูลสำเร็จ')
            alert('บันทึกข้อมูลล้มเหลว')
    }

    useEffect(() => {
        if(selectedSemester === null)
            return
        fetchForm()
    }, [selectedSemester])

    useEffect(() => {
        fetchSemesterList()
    }, [])

    return (
        <div className="page-content-container">
            <div className="form-search">
                <div className="form-search-select">
                    <label htmlFor="">ภาคการศึกษา: </label>
                    <Select
                        className="custom-react-select"
                        placeholder="-- โปรดระบุ --"
                        defaultValue={selectedSemester}
                        onChange={selected => {
                            setSelectedSemester(selected.value)
                        }}
                        options={semesterList !== null && semesterList.map(semester => {
                            return {
                                value: semester.id,
                                label: semester.title
                            }
                        })}></Select>
                </div>
                <div className="form-search-select">
                    <label htmlFor="">ภาควิชา: </label>
                    <Select
                        className="custom-react-select"
                        placeholder="-- โปรดระบุ --"
                        defaultValue={{
                            value: userInfo.groups[0].id,
                            label: userInfo.groups[0].title
                        }}
                        isDisabled></Select>
                </div>
                <div className="form-search-select">
                    <label htmlFor="">ชื่ออาจารย์: </label>
                    <Select
                        className="custom-react-select"
                        placeholder="-- โปรดระบุ --"
                        defaultValue={{
                            value: userInfo.id,
                            label: userInfo.name
                        }}
                        isDisabled
                        ></Select>
                </div>
            </div>
            {userRawData !== null &&
                userFormTemplate !== null &&
                summaryFormTemplate !== null &&
                FormSelectButtonBar()}
            <Routes>
                <Route path="/fill"
                    element={
                        <FillUserForm
                            formTemplate={userFormTemplate}
                            setFormTemplate={setUserFormTemplate}
                            formData={userRawData}
                            setFormData={setUserRawData}
                            semesterId={selectedSemester}
                            userId={userInfo.id}
                            save={save}
                        />
                    }
                />
                <Route path="/summary"
                    element={
                        <ViewSummaryForm
                            formTemplate={summaryFormTemplate}
                            setFormTemplate={setSummaryFormTemplate}
                            userData={userRawData}
                            setUserData={setUserRawData} />
                    }
                />
            </Routes>
        </div>
    )
}

export default ViewUserForm
import { useEffect, useState } from "react"
import FillUserForm from "../ViewUserFormComponents/FillUserForm"
import ViewSummaryForm from "../ViewUserFormComponents/ViewSummaryForm"
import callApi from "../../utils/callApi"
import Select from "react-select"
import { Link, Route, useSearchParams, Routes } from "react-router-dom"

function ViewUserForm(props) {

    const [searchParams, setSearchParams] = useSearchParams({})

    const [selectedForm, setSelectedForm] = useState('user-form')
    const [departmentList, setDepartmentList] = useState(null)
    const [semesterList, setSemesterList] = useState(null)
    const [userList, setUserList] = useState(null)
    const [filteredUserList, setFilteredUserList] = useState([])

    const [selectedDepartment, setSelectedDepartment] = useState(null)
    const [selectedSemester, setSelectedSemester] = useState(null)
    const [selectedUser, setSelectedUser] = useState(null)

    const [userRawData, setUserRawData] = useState(null)
    const [userFormTemplate, setUserFormTemplate] = useState(null)
    const [summaryFormTemplate, setSummaryFormTemplate] = useState(null)

    const formActiveStyle = {
        backgroundColor: 'rgb(0, 87, 181)',
        color: 'white'
    }

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
        res = await callApi(`${process.env.REACT_APP_SERVER_URL}/semester/${selectedSemester}/raw_data/${selectedUser}/`, 'GET', null)
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
        res = await callApi(`${process.env.REACT_APP_SERVER_URL}/semester/${selectedSemester}/raw_data/${selectedUser}/`, 'PUT', rawData)
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
        return (
            <div className="form-select">
                <Link to='./user' style={window.location.pathname.endsWith('user') ? formActiveStyle : undefined} >ฟอร์ม Work load</Link>
                <Link to='./summary' style={window.location.pathname.endsWith('summary') ? formActiveStyle : undefined} >ฟอร์มสรุป</Link>
            </div>
        )
    }

    const initiateWithParams = () => {
        const semesterId = searchParams.get('semesterId')
        const userId = searchParams.get('userId')
        if (semesterId === null || userId === null) {
            setSearchParams({})
            return
        }
        setSelectedSemester(semesterId)
        setSelectedUser(userId)
        fetchForm()
    }

    const save = async () => {
        const res = await callApi(`${process.env.REACT_APP_SERVER_URL}/semester/${selectedSemester}/raw_data/${selectedUser}/`, 'PUT', userRawData)
        const resData = await res.json()
        if(resData.status === 'success')
            return alert('บันทึกข้อมูลสำเร็จ')
            alert('บันทึกข้อมูลล้มเหลว')
    }

    useEffect(() => {
        if(selectedSemester === null || selectedUser === null)
            return
        fetchForm()
    }, [selectedSemester, selectedUser])

    useEffect(() => {
        fetchDepartmentList()
        fetchSemesterList()
        fetchUserList()
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
                        onChange={selected => {
                            setSelectedDepartment(selected.value)
                            filterUserListByDepartmentID(selected.value)
                        }}
                        options={departmentList !== null && departmentList.map(dep => {
                            return {
                                value: dep.id,
                                label: dep.title
                            }
                        })}></Select>
                </div>
                <div className="form-search-select">
                    <label htmlFor="">ชื่ออาจารย์: </label>
                    <Select
                        className="custom-react-select"
                        placeholder="-- โปรดระบุ --"
                        onChange={selected => {
                            setSelectedUser(selected.value)
                        }}
                        options={filteredUserList !== null && filteredUserList.map(user => {
                            return {
                                value: user.id,
                                label: user.name
                            }
                        })}></Select>
                </div>
                {/* <button onClick={() => fetchForm()}>ค้นหา</button> */}
            </div>
            {userRawData !== null &&
            userFormTemplate !== null &&
            summaryFormTemplate !== null &&
            FormSelectButtonBar()}
            <Routes>
                <Route path="/user"
                    element={
                        <FillUserForm
                            formTemplate={userFormTemplate}
                            setFormTemplate={setUserFormTemplate}
                            formData={userRawData}
                            setFormData={setUserRawData}
                            semesterId={selectedSemester}
                            userId={selectedUser}
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
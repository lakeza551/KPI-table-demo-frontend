import { useEffect, useState } from "react"
import { Routes, Route, Link, useSearchParams, useNavigate, useLocation } from "react-router-dom"
import { BeatLoader } from "react-spinners"
import ViewSummaryForm from "../ViewUserFormComponents/ViewSummaryForm"
import FillUserForm from "../ViewUserFormComponents/FillUserForm"
import callApi from "../../utils/callApi"
import Select from "react-select"
import Cookies from "universal-cookie"

function ViewUserForm() {
    const cookies = new Cookies()
    const navigate = useNavigate()
    const { userInfo } = cookies.get(process.env.REACT_APP_COOKIE_NAME_TOKEN)
    const [searchParams, setSearchParams] = useSearchParams({})
    const [isLoading, setIsLoading] = useState(false)
    const [semesterList, setSemesterList] = useState(null)
    const [selectedSemester, setSelectedSemester] = useState(null)
    const [selectedSemesterTitle, setSelectedSemesterTitle] = useState(null)
    const [userList, setUserList] = useState(null)

    const [selectedUser, setSelectedUser] = useState(userInfo.id)

    const [userRawData, setUserRawData] = useState(null)
    const [userFormTemplate, setUserFormTemplate] = useState(null)
    const [summaryFormTemplate, setSummaryFormTemplate] = useState(null)

    const fetchSemesterList = async () => {
        const res = await callApi(`${process.env.REACT_APP_SERVER_URL}/semester/`, 'GET', null)
        const resData = await res.json()
        resData.data.reverse()
        setSemesterList(resData.data)
    }

    const fetchUserList = async () => {
        const res = await callApi(`${process.env.REACT_APP_SERVER_URL}/group/${userInfo.groups[0].id}/`, 'GET', null)
        const resData = await res.json()
        setUserList(resData.data.user)
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

        var rawData = null
        if (selectedUser === userInfo.id && rawDataObj.status === 'fail') {
            rawData = await initiateRawDataIfNotFound(formTemplate)
        }
        else if (rawDataObj.status === 'success')
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
        //console.log(formTemplate)
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
        const location = useLocation()
        return (
            <div className="form-select">
                <Link to='./fill' style={location.pathname.endsWith('fill') ? formActiveStyle : undefined} >ฟอร์ม Work load</Link>
                <Link to='./summary' style={location.pathname.endsWith('summary') ? formActiveStyle : undefined} >ฟอร์มสรุป</Link>
            </div>
        )
    }

    useEffect(() => {
        navigate('/user/form')
        setIsLoading(true)
        const wrapper = async () => {
            if (selectedSemester === null)
                return
            fetchForm()
        }
        wrapper().finally(() => {
            setIsLoading(false)
        })
    }, [selectedSemester, selectedUser])

    useEffect(() => {
        setIsLoading(true)
        const wrapper = async () => {
            fetchSemesterList()
            if (userInfo.groups.length > 0 && userInfo.groups[0].is_staff)
                fetchUserList()
        }
        wrapper().finally(() => {
            setIsLoading(false)
        })
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
                            setSelectedSemesterTitle(selected.label)
                        }}
                        options={semesterList !== null && semesterList.filter(semester => semester.is_active).map(semester => {
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
                        defaultValue={
                        userInfo.groups.length > 0 ?
                        {
                            value: userInfo.groups[0].id,
                            label: userInfo.groups[0].title
                        } : {
                            value: '',
                            label: ''
                        }}
                        isDisabled></Select>
                </div>
                <div className="form-search-select">
                    <label htmlFor="">ชื่ออาจารย์: </label>
                    <Select
                        className="custom-react-select"
                        placeholder="-- โปรดระบุ --"
                        onChange={selected => {
                            setSelectedUser(selected.value)
                            setSelectedSemesterTitle(selected.label)
                        }}
                        defaultValue={{
                            value: userInfo.id,
                            label: userInfo.name
                        }}
                        options={userList !== null && userList.map(user => {
                            return {
                                value: user.id,
                                label: user.name
                            }
                        })}
                        isDisabled={userInfo.groups.length > 0 && !userInfo.groups[0].is_staff}
                    ></Select>
                </div>
            </div>
            {isLoading && (
                <div className="center">
                    <BeatLoader size={40} color="rgb(0, 87, 181)" />
                </div>
            )}
            {
                userFormTemplate !== null &&
                summaryFormTemplate !== null &&
                FormSelectButtonBar()
            }
            {!isLoading && (
                <>
                    <Routes>
                        <Route path="/fill"
                            element={
                                <FillUserForm
                                    formTemplate={userFormTemplate}
                                    setFormTemplate={setUserFormTemplate}
                                    formData={userRawData}
                                    setFormData={setUserRawData}
                                    semesterId={selectedSemester}
                                    semesterTitle={selectedSemesterTitle}
                                    userId={userInfo.id}
                                    saveFilesUrl={`${process.env.REACT_APP_SERVER_URL}/semester/${selectedSemester}/upload/me/`}
                                    saveFormDataUrl={`${process.env.REACT_APP_SERVER_URL}/semester/${selectedSemester}/raw_data/me/`}
                                    disabled={userInfo.id === selectedUser ? false : true}
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
                </>
            )}
        </div>
    )
}

export default ViewUserForm
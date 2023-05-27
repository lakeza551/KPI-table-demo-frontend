import { Link, Route, Routes, useParams } from "react-router-dom"
import EditUserForm from './EditUserForm'
import EditSummaryForm from "./EditSummaryForm"
import { useEffect, useState } from "react"
import callApi from "../../utils/callApi"

function EditForm(props) {

    const formActiveStyle = {
        backgroundColor: 'rgb(0, 87, 181)',
        color: 'white'
    }

    const [selectedForm, setSelectedForm] = useState('null')
    const [userForm, setUserForm] = useState([])
    const [summaryForm, setSummaryForm] = useState([])
    const [semesterTitle, setSemesterTitle] = useState('')
    const { semesterId } = useParams()
    
    const fetchSemesterInfo = async () => {
        const res = await callApi(`${process.env.REACT_APP_SERVER_URL}/semester/${semesterId}/`, 'GET', null)
        const resData = await res.json()
        setSemesterTitle(resData.data.title)
    }

    const fetchForm = async () => {
        var res
        var resData
        //user form
        res = await callApi(`${process.env.REACT_APP_SERVER_URL}/semester/${semesterId}/form/`, 'GET', null)
        resData = await res.json()
        if(Object.keys(resData.data).length !== 0)
            setUserForm(resData.data)

        //summary form
        res = await callApi(`${process.env.REACT_APP_SERVER_URL}/semester/${semesterId}/summary/`, 'GET', null)
        resData = await res.json()
        if(Object.keys(resData.data).length !== 0)
            setSummaryForm(resData.data)
    }

    const save = async () => {
        var res
        var resData
        //user form
        try {
            await callApi(`${process.env.REACT_APP_SERVER_URL}/semester/${semesterId}/form/`, 'PUT', userForm)
            await callApi(`${process.env.REACT_APP_SERVER_URL}/semester/${semesterId}/summary/`, 'PUT', summaryForm)
            alert('บันทึกสำเร็จ')
        } catch (error) {
            alert('บันทึกล้มเหลว')
        }
    }

    useEffect(() => {
        fetchSemesterInfo()
        fetchForm()
    }, [])

    const FormSelectButtonBar = () => {
        return (
            <div className="form-select">
                <Link
                    style={window.location.pathname.endsWith('user-form') ? formActiveStyle : undefined}  
                    onClick={() => setSelectedForm('user-form')} 
                    to="./user-form">
                    ฟอร์ม Work load
                </Link>
                <Link
                    style={window.location.pathname.endsWith('summary-form') ? formActiveStyle : undefined} 
                    onClick={() => setSelectedForm('summary-form')} 
                    to="./summary-form">
                    ฟอร์มสรุป
                </Link>
                <Link 
                    style={window.location.pathname.endsWith('dashboard-form') ? formActiveStyle : undefined} 
                    onClick={() => setSelectedForm('dashboard-form')} 
                    to="./dashboard-form">
                    ฟอร์ม Dashboard
                </Link>
            </div>
        )
    }

    return (
        <div className="content-container">
            <FormSelectButtonBar />
            <div className="semester-title-container">
                <label>ชื่อเทอม</label>
                <label>{semesterTitle}</label>
            </div>
            <div className="float-button-bar">
                {/* <button onClick={load}>Load</button> */}
                <button onClick={save}>Save</button>
            </div>
            <Routes>
                <Route path="/summary-form" element={<EditSummaryForm form={summaryForm} setForm={setSummaryForm}/>}></Route>
                <Route path="/user-form" element={<EditUserForm form={userForm} setForm={setUserForm}/>}></Route>
            </Routes>
        </div>
    )

}

export default EditForm
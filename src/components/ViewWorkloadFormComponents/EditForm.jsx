import { Link, Route, Routes, useParams, useNavigate, useLocation } from "react-router-dom"
import EditUserForm from './EditUserForm'
import EditSummaryForm from "./EditSummaryForm"
import EditDashboardForm from "./EditDashboardForm"
import { useEffect, useState } from "react"
import callApi from "../../utils/callApi"
import fetchSemesterList from '../../utils/fetchSemesterList'
import { GrFormClose } from 'react-icons/gr'

function EditForm(props) {
    const formActiveStyle = {
        backgroundColor: 'rgb(0, 87, 181)',
        color: 'white'
    }

    const [selectedForm, setSelectedForm] = useState('null')
    const [userForm, setUserForm] = useState([])
    const [summaryForm, setSummaryForm] = useState([])
    const [dashboardForm, setDashboardForm] = useState([])
    const [semesterTitle, setSemesterTitle] = useState('')
    const [semesterList, setSemesterList] = useState(null)
    const [showImportFormMenu, setShowImportFormMenu] = useState(false)
    const [selectedImportForm, setSelectedImportForm] = useState(null)
    const [jsonFile, setJsonFile] = useState(null)

    const { semesterId } = useParams()
    const navigate = useNavigate()

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
        if (Object.keys(resData.data).length !== 0)
            setUserForm(resData.data)

        //summary form
        res = await callApi(`${process.env.REACT_APP_SERVER_URL}/semester/${semesterId}/summary/`, 'GET', null)
        resData = await res.json()
        if (Object.keys(resData.data).length !== 0)
            setSummaryForm(resData.data)

        //dashboard form
        res = await callApi(`${process.env.REACT_APP_SERVER_URL}/semester/${semesterId}/dashboard/`, 'GET', null)
        resData = await res.json()
        if (Object.keys(resData.data).length !== 0)
            setDashboardForm(resData.data)
    }

    const save = async () => {
        //user form
        try {
            var res, resJson
            res = await callApi(`${process.env.REACT_APP_SERVER_URL}/semester/${semesterId}/form/`, 'PUT', userForm)
            resJson = await res.json()
            if(resJson.status === 'fail')
                throw resJson.data
            res = await callApi(`${process.env.REACT_APP_SERVER_URL}/semester/${semesterId}/summary/`, 'PUT', summaryForm)
            resJson = await res.json()

            if(resJson.status === 'fail')
                throw resJson.data

            res = await callApi(`${process.env.REACT_APP_SERVER_URL}/semester/${semesterId}/dashboard/`, 'PUT', dashboardForm)
            resJson = await res.json()
            if(resJson.status === 'fail')
                throw resJson.data
            alert('บันทึกสำเร็จ')
        } catch (error) {
            alert('บันทึกล้มเหลว\n' + error)
        }
    }

    const exportJson = async () => {
        var obj = {
            user: userForm,
            summary: summaryForm,
            dashboard: dashboardForm
        }
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj));
        var dlAnchorElem = document.createElement('a')
        dlAnchorElem.setAttribute("href",     dataStr     );
        dlAnchorElem.setAttribute("download", `${semesterTitle}.json`);
        dlAnchorElem.click();
    }

    const importForm = async () => {
        try {
            const reader = new FileReader()

            reader.onload = e => {
                const json = JSON.parse(e.target.result)
                setUserForm(json.user === undefined ? null : json.user)
                setSummaryForm(json.summary === undefined ? null : json.summary)
                setDashboardForm(json.dashboard === undefined ? null : json.dashboard)
            }

            reader.readAsText(jsonFile)
        } catch (error) {
            //console.log(error)
            alert('Import ฟอร์มล้มเหลว')
        }
        setShowImportFormMenu(false)
    }

    const ImportFormMenu = () => {
        return (
            <div className="backdrop">
                <div className="popup">
                    <button className="popup-close">
                        <GrFormClose onClick={() => setShowImportFormMenu(false)} size={30} color='rgb(240, 240, 240)' />
                    </button>
                    <div className="popup-input-container">
                        <label>ไฟล์ (.json)</label>
                        <input type="file" onChange={e => {
                            setJsonFile(e.target.files[0])
                        }}/>
                    </div>
                    <button onClick={importForm} className="popup-button-edit margin-top-20px">Import</button>
                </div>
            </div>
        )
    }

    useEffect(() => {
        fetchSemesterList(setSemesterList)
        fetchSemesterInfo()
        fetchForm()
    }, [])

    const FormSelectButtonBar = () => {
        const location = useLocation()
        //console.log(location)
        return (
            <div className="form-select">
                <Link
                    style={location.pathname.endsWith('user-form') ? formActiveStyle : undefined}
                    onClick={() => setSelectedForm('user-form')}
                    to="./user-form">
                    ฟอร์ม Work load
                </Link>
                <Link
                    style={location.pathname.endsWith('summary-form') ? formActiveStyle : undefined}
                    onClick={() => setSelectedForm('summary-form')}
                    to="./summary-form">
                    ฟอร์มสรุป
                </Link>
                <Link
                    style={location.pathname.endsWith('dashboard-form') ? formActiveStyle : undefined}
                    onClick={() => setSelectedForm('dashboard-form')}
                    to="./dashboard-form">
                    ฟอร์ม Dashboard
                </Link>
            </div>
        )
    }

    return (
        <div className="page-content-container">
            {showImportFormMenu && ImportFormMenu()}
            <FormSelectButtonBar />
            <div className="semester-title-container">
                <label>ชื่อเทอม</label>
                <label>{semesterTitle}</label>
            </div>
            <div className="float-button-bar">
                {/* <button onClick={load}>Load</button> */}
                <button onClick={save}>Save</button>
                <button onClick={() => setShowImportFormMenu(true)}>Import</button>
                <button onClick={exportJson}>Export</button>
            </div>
            <Routes>
                <Route path="/summary-form" element={<EditSummaryForm form={summaryForm} setForm={setSummaryForm} />}></Route>
                <Route path="/user-form" element={<EditUserForm form={userForm} setForm={setUserForm} />}></Route>
                <Route path="/dashboard-form" element={<EditDashboardForm form={dashboardForm} setForm={setDashboardForm} userFormTemplate={userForm} />}></Route>
            </Routes>
        </div>
    )

}

export default EditForm
import { Link } from "react-router-dom"
import callApi from "../../utils/callApi"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

function ViewWorkloadForm(props) {
    const navigate = useNavigate()

    const [semesterList, setSemesterList] = useState(null)

    const fetchSemesterList = async () => {
        const res = await callApi(`${process.env.REACT_APP_SERVER_URL}/semester/`, 'GET', null)
        const resData = await res.json()
        resData.data.reverse()
        setSemesterList(resData.data)
    }

    const createSemester = async (semesterTitle) => {
        const res = await callApi(`${process.env.REACT_APP_SERVER_URL}/semester/`, 'POST', {
            title: semesterTitle,
            description: 'ไม่มี'
        })
        const resData = await res.json()
        resData.status === 'success' && alert('สร้างฟอร์มสำเร็จ')
        fetchSemesterList()
    }

    useEffect(() => {
        fetchSemesterList()
    }, [])

    const ButtonBar = () => {
        return (
            <div className="button-bar">
                <button onClick={e => {
                    const semesterTitle = prompt('ระบุชื่อเทอม')
                    createSemester(semesterTitle)
                }}>สร้างเทอมใหม่</button>
            </div>
        )
    }

    const FormList = () => {
        if (semesterList === null)
            return
        //console.log(semesterList.map(semester => semester.title))
        return (
            <div className="formlist-container">
                {semesterList.map(semester => {
                        return (
                            <div className="formlist-row">
                                <Link to={`./edit/${semester.id}`}>{semester.title}</Link>
                                <div className="formlist-row-menu">
                                    <input onChange={async e => {
                                        var confirmText
                                        if(e.target.checked)
                                            confirmText = 'ต้องการเปิดใช้งานฟอร์ม ?'
                                        else
                                            confirmText = 'ต้องการปิดการใช้งานฟอร์ม ?'
                                        if(!window.confirm(confirmText))
                                            return
                                            
                                        try {
                                            const res = await callApi(`${process.env.REACT_APP_SERVER_URL}/semester/${semester.id}/`, 'PUT', {
                                                title: semester.title,
                                                description: semester.description,
                                                is_active: e.target.checked
                                            })
                                            console.log(await res.json())
                                            alert('แก้ไขสถานะสำเร็จ')
                                            navigate(0)
                                        } catch (error) {
                                            alert('แก้ไขสถานะล้มเหลว')
                                        }
                                    }} checked={semester.is_active} type="checkbox" name="" id="" />
                                    <label>เปิดใช้งาน</label>
                                </div>
                            </div>
                        )
                    })}
            </div>
        )
    }

    return (
        <div className="page-content-container">
            <ButtonBar />
            <FormList />
        </div>
    )

}

export default ViewWorkloadForm
import { Link } from "react-router-dom"
import callApi from "../utils/callApi"
import { useEffect, useState } from "react"

function ViewWorkloadForm(props) {

    const [semesterList, setSemesterList] = useState(null)

    const fetchSemesterList = async () => {
        const res = await callApi(`${process.env.REACT_APP_SERVER_URL}/semester/`, 'GET', null)
        const resData = await res.json()
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
        console.log(semesterList.map(semester => semester.title))
        return (
            <div className="formlist-container">
                {semesterList.map(semester => {
                        return (
                            <div className="formlist-row">
                                <Link to={`./edit/${semester.id}`}>{semester.title}</Link>
                                <div className="formlist-row-menu">
                                    <Link>แก้ไข</Link>
                                    <input type="checkbox" name="" id="" />
                                    <label>เปิดใช้งาน</label>
                                </div>
                            </div>
                        )
                    })}
            </div>
        )
    }

    return (
        <div className="content-container">
            <ButtonBar />
            <FormList />
        </div>
    )

}

export default ViewWorkloadForm
import { useEffect, useState } from "react"
import { BeatLoader } from "react-spinners"
import Cookies from "universal-cookie"
import DataTable from "react-data-table-component"
import checkUserDepartment from "../utils/checkUserDepartment"
import checkUserType from "../utils/checkUserType"
import callApi from "../utils/callApi"
import {GrFormClose} from 'react-icons/gr'

function ViewUserList() {
    const cookies = new Cookies()

    const [users, setUsers] = useState(null)
    const [departmentList, setDepartmentList] = useState(null)

    const [userPopupData, setUserPopupData] = useState(null)

    const fetchUsers = async () => {
        const res = await callApi(`${process.env.REACT_APP_SERVER_URL}/user/`, 'GET', null)
        const userList = (await res.json()).data
        setUsers(userList)
    }
    const fetchDepartment = async () => {
        const res = await callApi(`${process.env.REACT_APP_SERVER_URL}/group/`, 'GET', null)
        const departmentList = (await res.json()).data
        setDepartmentList(departmentList)
    }
    useEffect(() => {
        fetchUsers()
        fetchDepartment()
    }, [])

    if (users === null)
        return (
            <div className="center">
                <BeatLoader size={40} color="rgb(0, 87, 181)" />
            </div>
        )


    const EditPopup = () => {

        const submitEdit = async () => {
            try {
                var res
                //user data
                if(userPopupData.type === 'แอดมิน') {
                    res = await callApi(`${process.env.REACT_APP_SERVER_URL}/user/${userPopupData.userId}/`, 'PUT', {
                        name: userPopupData.name,
                        is_active: true,
                        is_admin: true
                    })
                }
                else if(userPopupData.type === 'อาจารย์' || userPopupData.type === 'หัวหน้าภาควิชา') {
                    res = await callApi(`${process.env.REACT_APP_SERVER_URL}/user/${userPopupData.userId}/`, 'PUT', {
                        name: userPopupData.name,
                        is_active: true,
                        is_admin: false
                    })
                }
                
                //group data
                if(userPopupData.oldDepartmentId !== -1) {
                    res = await callApi(`${process.env.REACT_APP_SERVER_URL}/group/remove_user/`, 'PUT', {
                        group_id: userPopupData.oldDepartmentId,
                        user_id: userPopupData.userId
                    })
                }
                
                if(userPopupData.departmentId !== -1) {
                    res = await callApi(`${process.env.REACT_APP_SERVER_URL}/group/add_user/`, 'PUT', {
                        group_id: userPopupData.departmentId,
                        user_id: userPopupData.userId,
                        is_staff: userPopupData.type === 'หัวหน้าภาควิชา' ? true : false
                    })
                }
                const resJson = await res.json()
                if(resJson.status === 'failed')
                    throw resJson
                alert('แก้ไขสำเร็จ')
            }
            catch(e) {
                alert('แก้ไขล้มเหลว')
            }
            window.location.reload(false)
        }

        return (
            <div className="backdrop">
                <div className="popup">
                    <button className="popup-close">
                        <GrFormClose onClick={() => setUserPopupData(null)} size={30} color='rgb(240, 240, 240)'/>
                    </button>
                    <div className="popup-input-container">
                        <label>ชื่อ - สกุล</label>
                        <input type="text" value={userPopupData.name} onChange={e => setUserPopupData(prev => (
                            {
                                ...prev,
                                name: e.target.value,
                            }
                        ))}/>
                    </div>
                    <div className="popup-input-container">
                        <label>ภาควิชา</label>
                        <select value={userPopupData.departmentId} onChange={e => setUserPopupData(prev => ({
                            ...prev,
                            departmentId: Number(e.target.value)
                        }))}>
                            <option value="-1">ไม่สังกัดภาควิชาใด</option>
                            {departmentList.map(dep => {
                                return <option value={dep.id}>{dep.title}</option>
                            })}
                        </select>
                    </div>
                    <div className="popup-input-container">
                        <label>สิทธิ์</label>
                        <select value={userPopupData.type} onChange={e => setUserPopupData(prev => ({
                            ...prev,
                            type: e.target.value
                        }))}>
                            <option value='อาจารย์'>อาจารย์</option>
                            <option value='หัวหน้าภาควิชา'>หัวหน้าภาควิชา</option>
                            <option value='แอดมิน'>แอดมิน</option>
                        </select>
                    </div>
                    <button onClick={submitEdit} className="popup-button-edit">แก้ไข</button>
                </div>
            </div>
        )
    }

    const Table = () => {
        const columns = [
            {
                name: "ID",
                selector: row => row.id,
                sortable: true,
                grow: 1
            },
            {
                name: "ชื่อ - นามสกุล",
                selector: row => row.name,
                sortable: true,
            },
            {
                name: "ภาควิชา",
                selector: row => checkUserDepartment(row),
                sortable: true
            },
            {
                name: "สิทธิ์",
                selector: row => checkUserType(row),
                sortable: true
            },
            {
                name: "",
                button: true,
                cell: row =>(
                        <>
                            <button onClick={() => setUserPopupData({
                                userId: row.id,
                                name: row.name,
                                oldDepartmentId: row.groups.length === 0 ? -1 : row.groups[0].id,
                                departmentId: row.groups.length === 0 ? -1 : row.groups[0].id,
                                type: checkUserType(row)
                            })}>Edit</button>
                            <button style={{marginLeft: '5px'}}>Delete</button>
                        </>
                    ) 
            }
        ]
        return <DataTable
            columns={columns}
            data={users}
        />
        
    }

    return (
        <div className="content-container">
            <div className="user-list-table-container">
                <Table />
                {userPopupData !== null && EditPopup()}
            </div>
        </div>
    )
}

export default ViewUserList
import { useEffect, useState } from "react"
import { BeatLoader } from "react-spinners"
import Cookies from "universal-cookie"
import DataTable from "react-data-table-component-with-filter"
import checkUserDepartment from "../../utils/checkUserDepartment"
import checkUserType from "../../utils/checkUserType"
import callApi from "../../utils/callApi"
import {GrFormClose} from 'react-icons/gr'
import { useNavigate } from "react-router-dom"

function Table(props) {
    var {setFilter, filter, setUserPopupData, users} = props  
    users = users.length === 0 ? ['no data'] : users
    const columns = [
        {
            name: (
                <div className="table-header">
                    <label>ID</label>
                    <input
                    onClick={e => {
                        e.stopPropagation()
                    }} 
                    onChange={e => {
                        setFilter(prev => {
                            return {
                                ...prev,
                                id: e.target.value
                            }
                        })
                    }}
                    value={filter.id}
                    placeholder="ค้นหาจาก ID" 
                    className="table-filter" 
                    type="text" />
                </div>
            ),
            selector: (row, index) => row === 'no data' ? '' : row.id,
            sortable: true,
            grow: 1
        },
        {
            name: (
                <div className="table-header">
                    <label>ชื่อ - นามสกุล</label>
                    <input 
                    value={filter.name} 
                    onClick={e => {
                        e.stopPropagation()
                    }}
                    onChange={e => {
                        setFilter(prev => {
                            return {
                                ...prev,
                                name: e.target.value
                            }
                        })
                    }} placeholder="ค้นหาจาก ชื่อ - นามสกุล" className="table-filter" type="text" />
                </div>
            ),
            selector: (row, index) => users[0] === 'no data' ? '' : row.name,
            sortable: true,
            grow: 2.3
        },
        {
            name: (
                <div className="table-header">
                    <label>ภาควิชา</label>
                    <input
                    value={filter.department} 
                    onClick={e => {
                        e.stopPropagation()
                    }}
                    onChange={e => {
                        setFilter(prev => {
                            return {
                                ...prev,
                                department: e.target.value
                            }
                        })
                    }} placeholder="ค้นหาจาก ภาควิชา" className="table-filter" type="text" />
                </div>
            ),
            selector: (row, index) => row === 'no data' ? '' : checkUserDepartment(row),
            sortable: true,
            grow: 2
        },
        {
            name: (
                <div className="table-header">
                    <label>สิทธิ์</label>
                    <input 
                    value={filter.type} 
                    onClick={e => {
                        e.stopPropagation()
                    }}
                    onChange={e => {
                        setFilter(prev => {
                            return {
                                ...prev,
                                type: e.target.value
                            }
                        })
                    }}placeholder="ค้นหาจาก สิทธิ์" className="table-filter" type="text" />
                </div>
            ),
            selector: (row, index) => row === 'no data' ? '' : checkUserType(row),
            sortable: true,
            grow: 1
        },
        {
            name: "",
            cell: (row, index) => row === 'no data' ? '' : (
                    <div className="user-menu">
                        <button onClick={() => setUserPopupData({
                            userId: row.id,
                            name: row.name,
                            oldDepartmentId: row.groups.length === 0 ? -1 : row.groups[0].id,
                            departmentId: row.groups.length === 0 ? -1 : row.groups[0].id,
                            type: checkUserType(row)
                        })}>Edit</button>
                        <button style={{marginLeft: '5px'}}>Delete</button>
                    </div>
                ) 
        }
    ]
    return <DataTable
        header
        key={'1'}
        columns={columns}
        data={users}
        pagination
        striped
    />
}

function ViewUserList() {
    const navigate = useNavigate()

    const [users, setUsers] = useState(null)
    const [filteredUsers, setFilteredUsers] = useState(null)
    const [filter, setFilter] = useState({
        id: '',
        name: '',
        department: '',
        type: ''
    })
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
            navigate(0)
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

    return (
        <div className="page-content-container">
            <div className="user-list-table-container">
                <Table
                setFilter={setFilter}
                filter={filter}
                setUserPopupData={setUserPopupData}
                users={
                users.filter(user => {
                    return user.name.includes(filter.name) &&
                            user.id.toString().includes(filter.id) &&
                            checkUserDepartment(user).includes(filter.department) &&
                            checkUserType(user).includes(filter.type)
                })
                }
                />
                {userPopupData !== null && EditPopup()}
            </div>
        </div>
    )
}

export default ViewUserList
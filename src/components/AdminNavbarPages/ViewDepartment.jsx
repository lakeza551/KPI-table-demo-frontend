import fetchDepartmentList from '../../utils/fetchDepartmentList'
import { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { BeatLoader } from "react-spinners"
import callApi from '../../utils/callApi'
import {GrFormClose} from 'react-icons/gr'

function ViewDepartment(props) {
    const [departmentList, setDepartmentList] = useState(null)
    const [popupData, setPopupData] = useState(null)

    useEffect(() => {
        fetchDepartmentList(setDepartmentList)
    }, [])

    if (departmentList === null)
        return (
            <div className="center">
                <BeatLoader size={40} color="rgb(0, 87, 181)" />
            </div>
        )


    const editDepartment = async () => {
        try {
            const params = {
                title: popupData.title,
                description: '',
                is_active: popupData.is_active
            }
            const res = await callApi(`${process.env.REACT_APP_SERVER_URL}/group/${popupData.departmentId}/`, 'PUT', params)
            fetchDepartmentList(setDepartmentList)
            alert('แก้ไขสำเร็จ')
        } catch (error) {
            alert('แก้ไขล้มเหลว')
        }
        setPopupData(null)
    }
    const addDepartment = async title => {
        try {
            await callApi(`${process.env.REACT_APP_SERVER_URL}/group/`, 'POST', {
                title: title,
                description: ''
            })
            fetchDepartmentList(setDepartmentList)
            alert('เพิ่มภาควิชาใหม่สำเร็จ')
        } catch (error) {
            alert('เพิ่มภาควิชาใหม่ล้มเหลว')
        }
    }

    const Table = () => {
        const columns = [
            {
                id: 'ID',
                name: "ID",
                selector: row => row.id,
                sortable: true,
                grow: 1
            },
            {
                name: "ชื่อภาควิชา",
                selector: row => row.title,
                sortable: false,
                grow: 1
            },
            {
                name: "สถานะ",
                selector: row => row.is_active ? 'เปิดใช้งาน' : 'ไม่ได้ใช้งาน',
                sortable: true,
                grow: 1
            },
            {
                name: "",
                button: true,
                cell: row =>(
                        <div className="user-menu">
                            <button onClick={() => setPopupData({
                                departmentId: row.id,
                                title: row.title,
                                is_active: row.is_active
                            })}>Edit</button>
                        </div>
                    ),
                grow: 1
            }
        ]
        return <DataTable
            columns={columns}
            data={departmentList}
            defaultSortFieldId={'ID'}
            defaultSortAsc={true}
            pagination
            striped
        />
        
    }

    return (
        <div className="page-content-container">
            {popupData !== null && (
            <div className="backdrop">
                <div className="popup">
                    <button className="popup-close">
                        <GrFormClose onClick={() => setPopupData(null)} size={30} color='rgb(240, 240, 240)'/>
                    </button>
                    <div className="popup-input-container">
                        <label>ชื่อภาควิชา</label>
                        <input type="text" value={popupData.title} onChange={e => setPopupData(prev => (
                            {
                                ...prev,
                                title: e.target.value,
                            }
                        ))}/>
                    </div>
                    <div className="popup-input-container">
                        <label>สถานะ</label>
                        <input type='checkbox' checked={popupData.is_active} onChange={e => setPopupData(prev => ({
                            ...prev,
                            is_active: e.target.checked
                        }))}/>
                    </div>
                    <button onClick={editDepartment} className="popup-button-edit">แก้ไข</button>
                </div>
            </div>
        )}
            <div className="button-bar">
                <button onClick={e => {
                    const departmentTitle = prompt('ระบุชื่อเทอม')
                    if(departmentTitle === null)
                        return
                    addDepartment(departmentTitle)
                }}>เพิ่มภาควิชาใหม่</button>
            </div>
            <div className="user-list-table-container">
                <Table />
            </div>
        </div>
    )
}

export default ViewDepartment
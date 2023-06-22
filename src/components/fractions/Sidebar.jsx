import { Link } from "react-router-dom"
import Cookies from "universal-cookie"
import {FaUserCircle} from 'react-icons/fa'
import {MdSpaceDashboard} from 'react-icons/md'
import {HiClipboardDocumentList} from 'react-icons/hi2'
import {IoIosPaper} from 'react-icons/io'
import {FaLayerGroup} from 'react-icons/fa'

function Sidebar(props) {
    const cookies = new Cookies()
    const userTokenObj = cookies.get(process.env.REACT_APP_COOKIE_NAME_TOKEN)
    const selectedPage = window.location.pathname.split('/')[2]
    if(userTokenObj === undefined)
        return <div></div>
    return (
        <div className="sidebar">
            {userTokenObj.userInfo.is_admin && 
            <Link 
            style={selectedPage === 'dashboard' ? {backgroundColor: 'white'} : undefined} 
            to='./dashboard'><MdSpaceDashboard size={30} style={{marginRight: '10px'}}/> Dashboard</Link>}

            {userTokenObj.userInfo.is_admin && 
            <Link 
            style={selectedPage === 'users' ? {backgroundColor: 'white'} : undefined} 
            to='./users'><FaUserCircle size={30} style={{marginRight: '10px'}}/> Users</Link>}

            {userTokenObj.userInfo.is_admin && 
            <Link 
            style={selectedPage === 'workload-form' ? {backgroundColor: 'white'} : undefined} 
            to='./workload-form'><HiClipboardDocumentList size={30} style={{marginRight: '10px'}}/> Workload Form</Link>}

            {userTokenObj.userInfo.is_admin && 
            <Link 
            style={selectedPage === 'user-form' ? {backgroundColor: 'white'} : undefined} 
            to='./user-form'><IoIosPaper size={30} style={{marginRight: '10px'}}/>View User Form</Link>}

            {userTokenObj.userInfo.is_admin && 
            <Link 
            style={selectedPage === 'department' ? {backgroundColor: 'white'} : undefined} 
            to='./department'><FaLayerGroup size={30} style={{marginRight: '10px'}}/>Department</Link>}

            {!userTokenObj.userInfo.is_admin && 
            <Link 
            style={selectedPage === 'form' ? {backgroundColor: 'white'} : undefined} 
            to='./form'><HiClipboardDocumentList size={30} style={{marginRight: '10px'}}/>Workload Form</Link>}

            {!userTokenObj.userInfo.is_admin && userTokenObj.userInfo.groups[0].is_staff && 
            <Link 
            style={selectedPage === 'dashboard' ? {backgroundColor: 'white'} : undefined} 
            to='./dashboard'><MdSpaceDashboard size={30} style={{marginRight: '10px'}}/>สรุป</Link>}
        </div>
    )
}

export default Sidebar
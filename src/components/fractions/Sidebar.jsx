import { Link } from "react-router-dom"
import Cookies from "universal-cookie"
import {FaUserCircle} from 'react-icons/fa'
import {MdSpaceDashboard} from 'react-icons/md'
import {HiClipboardDocumentList} from 'react-icons/hi2'
import {IoIosPaper} from 'react-icons/io'

function Sidebar(props) {
    const cookies = new Cookies()
    const userTokenObj = cookies.get(process.env.REACT_APP_COOKIE_NAME_TOKEN)
    if(userTokenObj === undefined)
        return <div></div>
    return (
        <div className="sidebar">
            {userTokenObj.userInfo.is_admin && 
            <Link to='./dashboard'><MdSpaceDashboard size={30} style={{marginRight: '10px'}}/> Dashboard</Link>}
            {userTokenObj.userInfo.is_admin && 
            <Link to='./users'><FaUserCircle size={30} style={{marginRight: '10px'}}/> Users</Link>}
            {userTokenObj.userInfo.is_admin && 
            <Link to='./workload-form'><HiClipboardDocumentList size={30} style={{marginRight: '10px'}}/> Workload Form</Link>}
            {userTokenObj.userInfo.is_admin && 
            <Link to='./user-form'><IoIosPaper size={30} style={{marginRight: '10px'}}/>View User Form</Link>}
            {!userTokenObj.userInfo.is_admin && 
            <Link to='./form'><HiClipboardDocumentList size={30} style={{marginRight: '10px'}}/>Workload Form</Link>}
        </div>
    )
}

export default Sidebar
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import Cookies from "universal-cookie"

function Navbar(props) {
    const navigate = useNavigate()
    const cookies = new Cookies()
    const {userInfo} = cookies.get(process.env.REACT_APP_COOKIE_NAME_TOKEN)
    console.log(userInfo)
    return (
        <div className="navbar">
            <label className="navbar-label" htmlFor="">
             SC-Workload
            </label>
            <div className="navbar-user-info">
                <label>ยินดีต้อนรับ {userInfo.name}</label>
            </div>
            <div className="navbar-button">
                <button onClick={() => {
                    cookies.remove(process.env.REACT_APP_COOKIE_NAME_TOKEN)
                    navigate('/auth')
                }}>ออกจากระบบ</button>
            </div>
        </div>
    )
}

export default Navbar
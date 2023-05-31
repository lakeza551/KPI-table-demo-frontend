import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import Cookies from "universal-cookie"

function Navbar(props) {
    const navigate = useNavigate()
    const cookies = new Cookies()
    return (
        <div className="navbar">
            <label htmlFor="">
                SC-SU-Workload
            </label>
            <div className="navbar-button">
                <button onClick={() => {
                    cookies.remove(process.env.REACT_APP_COOKIE_NAME_TOKEN)
                    navigate('/auth')
                }}>LOG OUT</button>
            </div>
        </div>
    )
}

export default Navbar
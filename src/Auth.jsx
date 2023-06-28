import { useState } from "react"
import { useNavigate } from "react-router-dom"
import callApi from './utils/callApi'
import Cookies from "universal-cookie"

function Auth() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const cookies = new Cookies()
    const navigate = useNavigate()

    return (
        <div className="homepage-container">
            <div className="homepage-card">
                <label className="homepage-header">SC-Workload</label>
                <div className="homepage-login-form">
                    <a href="/login" className="homepage-button">เข้าสู่ระบบ</a>
                </div>
            </div>
        </div>
    )
}

export default Auth
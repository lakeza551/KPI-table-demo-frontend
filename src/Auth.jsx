import { useState } from "react"
import { useNavigate } from "react-router-dom"
import callApi from './utils/callApi'
import Cookies from "universal-cookie"

function Auth() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const cookies = new Cookies()
    const navigate = useNavigate()
    const login = async () => {
        const raw = JSON.stringify({
            username: username,
            password: password
        })
        const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/auth/basic_login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: raw
        })
        const resData = await res.json()
        if (resData.status === 'success') {
            cookies.set(process.env.REACT_APP_COOKIE_NAME_TOKEN, resData.data, {
                path: '/'
            })
            return navigate('/')
        }
        alert('ไม่สามารถเข้าสูระบบได้')
    }

    return (
        <div className="homepage-container">
            <div className="homepage-card">
                <label className="homepage-header">SCSU-Workload</label>
                <div className="homepage-login-form">
                    <input type="text" placeholder="Username" onChange={e => {
                        setUsername(e.target.value)
                    }} />
                    <input type="password" placeholder="Password" onChange={e => {
                        setPassword(e.target.value)
                    }} />
                    <button onClick={login} className="homepage-button">เข้าสู่ระบบ</button>
                </div>
            </div>
        </div>
    )
}

export default Auth
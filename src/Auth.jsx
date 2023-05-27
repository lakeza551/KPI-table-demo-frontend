import { useState } from "react"
import { Link, Routes, Route, useNavigate } from "react-router-dom"
import Cookies from "universal-cookie"
import AdminHomePage from "./components/AdminHomePage"

function Auth() {
    const [username, setUsername] = useState(null)
    const [password, setPassword] = useState(null)
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
        if(resData.status === 'success') {
            cookies.set(process.env.REACT_APP_COOKIE_NAME, resData.data, {
                path: '/'
            })
            console.log(cookies.get(process.env.REACT_APP_COOKIE_NAME))
            return navigate('/')
        }
    }

    const AdminLogin = () => {
        return (
            <div className="homepage-login-form">
                <input type="text" placeholder="Username" onChange={e => {
                    setUsername(e.target.value)
                }}/>
                <input type="password" placeholder="Password" onChange={e => {
                    setPassword(e.target.value)
                }}/>
                <button onClick={login} className="homepage-button">เข้าสู่ระบบ</button>
            </div>
        )
    }

    const LoginSelector = () => {
        return (
            <div className="homepage-button-container">
                <Link to={'./admin-login'} className="homepage-button">เข้าสู่ระบบแอดมิน</Link>
                <Link to={'./teacher-login'} className="homepage-button">เข้าสู่ระบบผู้ใช้</Link>
            </div>
        )
    }

    return (
        <div className="homepage-container">
            <div className="homepage-card">
                <label className="homepage-header">SCSU-Workload</label>
                <Routes >
                    <Route path="/" element={<LoginSelector/>}/>
                    <Route path="/admin-login" element={<AdminLogin/>}/>
                </Routes>
            </div>
        </div>
    )
}

export default Auth
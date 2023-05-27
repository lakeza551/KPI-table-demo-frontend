import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Cookies from "universal-cookie"

function Home() {
    const navigate = useNavigate()
    const cookies = new Cookies()
    const workloadCookie = cookies.get(process.env.REACT_APP_COOKIE_NAME)
    useEffect(() => {
        if(!workloadCookie) {
            return navigate('/auth')
        }
        if(workloadCookie) {
            return navigate('/admin')
        }
    })
}

export default Home
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import callApi from "./utils/callApi"
import Cookies from "universal-cookie"

function Home() {
    const navigate = useNavigate()
    const cookies = new Cookies()
    //cookies.remove(process.env.REACT_APP_COOKIE_NAME_TOKEN)
    const workloadCookie = cookies.get(process.env.REACT_APP_COOKIE_NAME_TOKEN)
    //console.log(workloadCookie)

    const getUserInfo = async () => {
        try {
            const res = await callApi(`${process.env.REACT_APP_SERVER_URL}/user/me/`, 'GET', null)
            const resData = await res.json()
            cookies.set(process.env.REACT_APP_COOKIE_NAME_TOKEN, {
                ...cookies.get(process.env.REACT_APP_COOKIE_NAME_TOKEN),
                userInfo: resData.data
            }, {
                path: '/'
            })
            return resData.data
        }
        catch(e) {
            return null
        }
    }


    useEffect(() => {
        if(!workloadCookie)
            return navigate('./auth')
        getUserInfo().then(userData => {
            if(userData.is_admin)
                navigate('./admin/dashboard')
            else
                navigate('./user/form')
        })
    })
}

export default Home
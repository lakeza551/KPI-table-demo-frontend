import Cookies from "universal-cookie"

async function callApi(url, method, params) {
    const cookies = new Cookies()
    //console.log(cookies.get(process.env.REACT_APP_COOKIE_NAME_TOKEN))
    await refreshToken()
    const workloadCookie = cookies.get(process.env.REACT_APP_COOKIE_NAME_TOKEN)
    const headers = {
        'Authorization': `Bearer ${workloadCookie.access_token}`,
        'Content-Type': 'application/json'
    }
    if(method === 'GET') {
        const res =  await fetch(url, {
            headers: headers,
            method: 'GET'
        })
        return res
    }
    if(method === 'POST' || method === 'PUT') {
        return await fetch(url, {
            headers: headers,
            method: method,
            body: JSON.stringify(params)
        })
    }
}

const refreshToken = async () => {
    const cookies = new Cookies()
    const workloadCookie = cookies.get(process.env.REACT_APP_COOKIE_NAME_TOKEN)
    const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/auth/refresh_token/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            refresh_token: workloadCookie.refresh_token
        })
    })
    const resData = await res.json()
    cookies.set(process.env.REACT_APP_COOKIE_NAME_TOKEN, {
        ...cookies.get(process.env.REACT_APP_COOKIE_NAME_TOKEN),
        access_token: resData.data.access_token
    }, {
        path: '/'
    })
}

export default callApi
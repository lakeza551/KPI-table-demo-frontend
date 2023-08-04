import Cookies from "universal-cookie"

async function callApi(url, method, params, isFormdata = false) {
    const cookies = new Cookies()
    //console.log(cookies.get(process.env.REACT_APP_COOKIE_NAME_TOKEN))
    await refreshToken()
    const workloadCookie = cookies.get(process.env.REACT_APP_COOKIE_NAME_TOKEN)
    const headers = {
        'Authorization': `Bearer ${workloadCookie.access_token}`,
        'Content-Type': isFormdata ? 'multipart/form-data' : 'application/json'
    }
    if(method === 'GET') {
        const res =  await fetch(url, {
            headers: headers,
            method: 'GET'
        })
        return res
    }
    else if(method === 'POST' || method === 'PUT') {
        if(!isFormdata) {
            return await fetch(url, {
                headers: headers,
                method: method,
                body: JSON.stringify(params)
            })
        }
        else{
            const res = await fetch(url, {
                headers: {
                    'Authorization' : `Bearer ${workloadCookie.access_token}`, 
                },
                method: 'POST',
                body: params
            })
            return res
        }
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
        path: '/',
        expires: new Date(Date.now()+(12 * 60 * 60 * 1000))
    })
}

export default callApi
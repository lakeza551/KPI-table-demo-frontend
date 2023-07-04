const express = require('express')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const hashPassword = require('./services/hashPassword')
const queryString = require('querystring')
const fetch = require('node-fetch')
const Cookies = require('universal-cookie')
const https = require('follow-redirects').https
const bodyParser = require('body-parser')
const app = express()

dotenv.config()

const PORT = 3000

app.use(express.static('build'))
app.use(bodyParser.json())
app.use(cookieParser())

app.post('/register', async (req, res) => {
    const {id, name} = req.body
    const password = hashPassword(id)
    const {SERVER_URL} = process.env
    fetch(`${SERVER_URL}/user/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaXNfYWRtaW4iOnRydWUsImlzX2FjdGl2ZSI6dHJ1ZSwiZ3JvdXBzIjpbXSwiZXhwIjoxNjg4NDY1ODA0fQ.Y9JRmgUCXlDa0P--qhI9TR3EraiAZb9re-GgdXtQC3o'
        },
        body: JSON.stringify({
            username: id,
            password: password,
            name: name
        })
    })
    .then(async response => {
        const resBody = JSON.parse(await response.text())
        res.send(resBody)
    })
    .catch(err => {
        console.log(err)
        res.send('failed')
    })
})

app.get('/login', (req, res) => {
    console.log(process.env)
    const {CLIENT_ID, CLIENT_SECRET} = process.env
    res.redirect(
        `https://nidp.su.ac.th/nidp/oauth/nam/authz?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&response_type=code&grant_type=authorization_code&scope=suappportal&redirect_uri=http://workload.sc.su.ac.th/su-auth`
    )
})

app.get('/su-auth', async(req, res) => {
    const { code } = req.query
    const {CLIENT_ID, CLIENT_SECRET} = process.env
    const data = queryString.stringify({
        'code': code,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'grant_type': 'authorization_code',
        'redirect_uri': `http://workload.sc.su.ac.th/su-auth`
    })
    const options = {
        hostname: 'nidp.su.ac.th',
        port: 443,
        path: "/nidp/oauth/nam/token",
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': data.length
          }
      }

    var request = https.request(options, function(response) {
        var chunks = [];

        response.on("data", function(chunk) {
            chunks.push(chunk);
        });

        response.on("end", function(chunk) {
            var body = JSON.parse(Buffer.concat(chunks).toString());
            const { access_token } = body
            res.cookie('su-access-token', access_token)
            res.redirect('/su-auth-get-info')
        });

        response.on("error", function(error) {
            res.send(error)
            console.error(error);
        });
    });
    request.write(data)
    request.end()
})

app.get('/su-auth-get-info', (req, res) => {
    const access_token = req.cookies['su-access-token'];
    options = {
        'method': 'GET',
        'hostname': 'nidp.su.ac.th',
        'path': '/nidp/oauth/nam/userinfo',
        'headers': {
            'Authorization': `Bearer ${access_token}`,
        }
    }
    var request = https.request(options, result => {
        var chunks = [];

        result.on("data", function (chunk) {
            chunks.push(chunk);
        });

        result.on("end", async function (chunk) {
            const cookies = new Cookies(res.cookie)
            var body = Buffer.concat(chunks).toString('utf8');
            body = JSON.parse(body)
            //console.log(body)
            const {SERVER_URL, REACT_APP_COOKIE_NAME_TOKEN} = process.env
            const response = await fetch(`${SERVER_URL}/auth/basic_login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: body.uid,
                    password: hashPassword(body.uid)
                })
            })
            
            const resBody = JSON.parse(await response.text())
            if(resBody.status === 'success') {
                cookies.set(REACT_APP_COOKIE_NAME_TOKEN, resBody.data, {
                    httpOnly: false
                })
                res.cookie(REACT_APP_COOKIE_NAME_TOKEN, JSON.stringify(resBody.data))
                res.redirect('/#/')
            }
            if(resBody.status === 'failed')
                res.send("<script>alert('คุณไม่มีสิทธิ์เข้าถึงเว็บไซต์')</script>")
        });

        result.on("error", function (error) {
            console.error(error);
        });
    });
    request.end();
})

app.listen(PORT, () => {
    console.log(`app is running on PORT: ${PORT}`)
})
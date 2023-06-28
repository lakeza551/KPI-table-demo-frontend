const express = require('express')
const cookieParser = require('cookie-parser')
const path = require('path')
const queryString = require('querystring')
const https = require('follow-redirects').https
const app = express()

const PORT = 3000

const CLIENT_ID = '1d5d0546-0f74-400a-9bad-22182c72de3d'
const CLIENT_SECRET = 'KrKCyu9W5oC90kgZEx-KbUQfr4lFffj0UXxE8ACtB1TwRQzqotq-g088X5vjlCFj0aVppE-mkAwlT78yxHtHAA'

app.use(express.static('build'))
app.use(cookieParser())

app.get('/', (req, res) => {
    res.redirect('/#')
})

app.get('/#/*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
})

app.get('/login', (req, res) => {
    res.redirect(
        `https://nidp.su.ac.th/nidp/oauth/nam/authz?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&response_type=code&grant_type=authorization_code&scope=suappportal&redirect_uri=http://workload.sc.su.ac.th/su-auth`
    )
})

app.get('/su-auth', async(req, res) => {
    const { code } = req.query
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
    console.log(req.cookies)
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

        result.on("end", function (chunk) {
            var body = Buffer.concat(chunks).toString('utf8');
            console.log(body)
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
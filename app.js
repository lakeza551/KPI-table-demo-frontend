const express = require('express')
const path = require('path')
const queryString = require('querystring')
const https = require('follow-redirects').https
const app = express()

const PORT = 3000

const CLIENT_ID = '1d5d0546-0f74-400a-9bad-22182c72de3d'
const CLIENT_SECRET = 'KrKCyu9W5oC90kgZEx-kbUQfr4lFffj0UXxE8ACtB1TwRQzqotq-g088X5vjlCFj0aVppE-mkAwlT78yxHtHAA'

app.use(express.static('build'))

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
})

app.get('/login', (req, res) => {
    res.redirect(
        `https://nidp.su.ac.th/nidp/oauth/nam/authz?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&response_type=code&grant_type=authorization_code&scope=suappportal&redirect_uri=http://workload.sc.su.ac.th/su-auth`
    )
})

app.get('/redirect', async(req, res) => {
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
            console.log(body)
            //console.log(body.toString());
        });

        response.on("error", function(error) {
            res.send(error)
            console.error(error);
        });
    });
    request.write(data)
    request.end()
})

app.listen(PORT, () => {
    console.log(`app is running on PORT: ${PORT}`)
})
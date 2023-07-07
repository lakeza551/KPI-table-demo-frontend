const dotenv = require('dotenv')
const crypto = require('crypto')
dotenv.config()

const hashPassword = password => {
    const {PASSWORD_SALT} = process.env
    const hashedPassword = crypto.createHash('md5').update(PASSWORD_SALT + password + PASSWORD_SALT).digest('hex')
    return hashedPassword
}

console.log(hashPassword('KAEWJAMNONG_S'))
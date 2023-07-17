const dotenv = require('dotenv')
const crypto = require('crypto')
dotenv.config()

const hashPassword = password => {
    const {PASSWORD_SALT} = process.env
    console.log(PASSWORD_SALT)
    const hashedPassword = crypto.createHash('md5').update('jupajup' + password + 'jupajup').digest('hex')
    return hashedPassword
}

console.log(hashPassword('admin'))
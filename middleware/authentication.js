const jwt = require('jsonwebtoken')
const Unauthenticated = require('../errors/unauthenticated')


const authentication = async (req,res,next) => {
    //check for header
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Unauthenticated('authentication failed')
    }
    const token = authHeader.split(' ')[1]
    try {
        const payload = jwt.verify(token, process.env.jwt_secret)
        req.user = {userId: payload.userId, isAdmin: payload.isAdmin}
        next()
    } catch (error) {
        throw new Unauthenticated('authentication failed')
    }

}


module.exports = authentication
const router = require("express").Router()
const { StatusCodes } = require("http-status-codes");
const User = require("../models/User")
const BadRequestError = require('../errors/bad-request')
const Unauthenticated = require('../errors/unauthenticated')

//REGISTER
router.post("/register", async (req, res) => {
    const user = await User.create({...req.body})
    const token = user.createJWT()
    res.status(StatusCodes.CREATED).json({token});
});



//LOGIN
router.post("/login", async (req, res) => {
    const {email,password} = req.body
    if(!email || !password) {
      throw new BadRequestError('please provide email and password')
    }
    const user = await User.findOne({ email })

    if(!user) throw new Unauthenticated('not authenticated')

    const validPassword = await user.comparePassword(password)
    if(!validPassword) throw new Unauthenticated('wrong password')

    const token = user.createJWT()
    res.status(StatusCodes.OK).json({token})

});



module.exports = router;
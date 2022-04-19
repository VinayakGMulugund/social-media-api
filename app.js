require('dotenv').config()
require('express-async-errors')
const express = require("express")
const mongoose = require("mongoose")
const helmet = require("helmet")
const userRoute = require("./routes/users")
const authRoute = require("./routes/auth")
const postRoute = require("./routes/posts")
const xssclean = require('xss-clean')
const errorHandlerMiddleware = require('./middleware/error-handler.js')
const notFound = require("./middleware/not-found")

const authentication = require('./middleware/authentication')


const app = express()

const port = process.env.PORT || 3000

app.use(express.json())
app.use(helmet())
app.use(xssclean())



app.use('/api/users',authentication, userRoute)
app.use('/api/auth', authRoute)
app.use("/api/posts",authentication, postRoute)

app.use(notFound)
app.use(errorHandlerMiddleware)



const connect = async ()=>{
    try {
        await mongoose.connect(process.env.mongo_url)
        app.listen(port, ()=>{
            console.log(`server started at port ${port}`)
        }) 
    } catch (error) {
        console.log(error)
    }
}
connect()
const express = require('express')
const cors = require('cors')
const connectToDb = require('./config/dbConnection')
const { ObjectId } = require('mongodb');
const dotenv = require('dotenv').config()
const passport = require('passport')
const passportSetup = require('./passport')
const authRoute = require('./routes/auth')
const cookieparser = require('cookie-parser')
const session = require('express-session');
const memberRoute = require('./routes/memberRoute')
const blogRoute = require('./routes/blogRoute')
const middleWares = require('./routes/middleWaresRoute')
const commentRoute = require('./routes/commentRoute')

dotenv
connectToDb()
const app = express()
const PORT = process.env.PORT || 8001




app.use(cors({
    origin: "https://blog-khaki-tau-50.vercel.app"
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
    optionsSuccessStatus: 204,
}));

app.use(session({
    secret: 'secret', 
    resave: false,
    saveUninitialized: false,
    cookie: {
         secure: process.env.NODE_ENV === "production", // true in production
      sameSite: "none", // Critical for cross-domain cookies
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      domain: process.env.NODE_ENV === "production" ? ".vercel.app" : "localhost",  
    }
}));


app.set("trust proxy", 1)
// app.use(
//     session({
//       secret: 'secret', // Change this to a secret string
//       resave: false,
//       saveUninitialized: false,
//       cookie: {
//           secure: false //change to false
//       }, // Set secure to true if using HTTPS
        
//     })
// );

app.use(cookieparser())

app.use(passport.initialize())
app.use(passport.session())
//https://blog-khaki-tau-50.vercel.app
app.use(cors({
    origin: "https://blog-khaki-tau-50.vercel.app",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
    optionsSuccessStatus: 204
}))

app.options('*', cors());

app.use(express.json({limit: '10mb'}))

app.use('/session', middleWares)
app.use('/auth', authRoute)
app.use('/', memberRoute)
app.use('/member/blog', blogRoute)
app.use('/membercomment', commentRoute)

app.get('/', ( req, res ) => {
    res.send('Server is running')
})

app.listen(PORT, () => {
    console.log(`App is listening at port ${PORT}`)
})

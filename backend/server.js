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


const allowedOrigins = [
    "http://localhost:3000",
    "https://blog-khaki-tau-50.vercel.app",
    "https://blog-7j26.onrender.com"
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: "GET,POST,PUT,DELETE",
    credentials: true
}));

app.use(session({
    secret: 'secret', 
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true, 
        secure: process.env.NODE_ENV === "production", 
        sameSite: "None" 
    }
}));



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

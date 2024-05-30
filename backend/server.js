const express = require('express')
const cors = require('cors')
const connectToDb = require('./config/dbConnection')
const { ObjectId } = require('mongodb');
const dotenv = require('dotenv').config()
const bcrypt = require('bcryptjs')
const passport = require('passport')
const passportSetup = require('./passport')
const authRoute = require('./routes/auth')
const nodemailer = require('nodemailer')
const Member = require('./model/memberModel')
const Otp = require('./model/otpModel')
const Blog = require('./model/blogModel')
const Comment = require('./model/commentModel')
const jwt = require('jsonwebtoken')
const cookieparser = require('cookie-parser')
//const cookieSession = require('cookie-session')
const session = require('express-session');


dotenv
connectToDb()
const app = express()
const PORT = process.env.PORT || 8001



app.use(express.json({limit: '10mb'}))

// app.use(cookieSession({
//     name: "session",
//     keys: ["rank"],
//     maxAge: 24 * 60 * 60 * 100
// }))

app.use(
    session({
      secret: 'secret', // Change this to a secret string
      resave: false,
      saveUninitialized: false,
      cookie: {
          secure: process.env.NODE_ENV === 'production', // Only set secure to true if using HTTPS in production
          httpOnly: true,
          sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax'
      }, // Set secure to true if using HTTPS
        
    })
);

app.use(cookieparser())

app.use(passport.initialize())
app.use(passport.session())

app.use(cors({
    origin: "https://blog-khaki-tau-50.vercel.app",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
    optionsSuccessStatus: 204
}))

app.options('*', cors());


//setting up nodemailer
let transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // upgrade later with STARTTLS
    auth: {
      user: process.env.AUTH_EMAIL,
      pass: process.env.AUTH_PASS,
    },
  });

// testing nodemailer success
transporter.verify((error, success) => {
    if(error){
        console.log(error)
    }else{
        console.log("Ready for message")
        console.log(success)
    }
})
  
app.use('/auth', authRoute)

app.get('/', ( req, res ) => {
    console.log('Server is running')
    res.send('Server is running')
})

app.post('/register', async (req, res) => {
    const { img, username, email, password, passwordRepeat } = req.body

    try{
        await connectToDb()

        if(!username || !email || !password || !passwordRepeat){
            return res.status(400).json({message: 'All field are mandatory'})
        }

        if(password !== passwordRepeat){
            return res.status(400).json({message: 'Password do not match'})
        }

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt);

        const checkedMember = await Member.findOne({email})
        
        if(checkedMember){
            return res.status(401).json({message: 'User already exist'})
        }

        const checkedUsername = await Member.findOne({username})
        if(checkedUsername){
            return res.status(401).json({message: 'Username already exist'})
        }

        const newMember = await Member({
            img,
            username,
            email,
            password: hashPassword,
            verified: false
        })

        const result = await newMember.save()
        const verificationData = await sendOtpVerification(result)
        
        if(result.verified === false){
            return res.status(201).json(verificationData)
        }
        return res.status(201).json({message: 'Signup successful.'})

    }catch(err){
        console.log(err)
        return res.status(401).json({message: 'Error in Login'})
    }

})

const sendOtpVerification = async ({ _id, email }) => {

    try{
        const otp = `${Math.floor(1000 + Math.random() * 9999 )}`
    
        const mailDetails = {
            from: 'emmaranking07@gmail.com',
            to: email,
            subject: "Verify your email",
            html: `<p>Enter your otp ${otp} here</p>`
        }

        // hash the otp
        const salt = await bcrypt.genSalt(10)
        const hashOtp = await bcrypt.hash(otp, salt);

        const newOtp = await new Otp({
            userId: _id,
            otp: hashOtp,
            createdAt: Date.now(),
            expiresAt: Date.now() + 3600000
        })

        await newOtp.save()
        await transporter.sendMail(mailDetails)

        return {
            staus: "PENDING",
            message: "Verification otp email send",
            data: {
                userId: _id,
                email
            }
        }
    }catch(error){
        return { status: "FAILED", message: error.message }
    }
}

app.post('/verifyOtp', async ( req, res ) => {
    try{
        const { userId, otp } = req.body

    if( !userId || !otp ){
        return res.json({ status: "FAILED", message: error.message })
    }else{
        const otpVerification = await Otp.find({ userId })

        if(otpVerification.length <= 0){
            return res.json({ status: "FAILED", message: "Field can't be empty. Input your Otp" })
        }else{
            
            const { expiresAt } = otpVerification[0]
            const hashedOtp = otpVerification[0].otp

            if(expiresAt < Date.now()){
                await Otp.deleteOne({ userId })
                return res.json({ status: "FAILED", message: 'Code has expired. Request new code'})
            }else{
                const validOtp = await bcrypt.compare(otp, hashedOtp)

                if(!validOtp){
                    return res.json({ status: "FAILED", message: 'Invalid Otp'})
                } else {
                    await Member.updateOne({ _id: userId }, { verified: true})
                    await Otp.deleteOne({ userId })

                    return  res.json({
                        status: "VERIFIED",
                        message: "User verify"
                    })
                }
            }
        }
    }
    }catch(err){
        return res.json({
            status: "FAILED",
            message: err.message
        })
    }
})

//resend otp
app.post('/resendOtp', async ( req, res ) => {
    try{
        const { userId, email } = req.body

    if( !userId || !email ){
        return res.json({ status: "FAILED", message: 'An error occurred' })
    }else{
        await Otp.deleteOne({ userId })
        sendOtpVerification({ _id: userId, email })
    }
    }catch(err){
        res.json({
            status: "FAILED",
            message: err.message
        })
    }
})

app.post("/refreshtoken", (req, res, next) => {
    const refreshtoken = req.cookies.refreshToken;
    console.log(refreshtoken)
    if(!refreshtoken){
        return res.status(404).json({ message: false});
    }

    jwt.verify(refreshtoken, process.env.REFRESH_TOKEN_KEY, (err, memberData) => {
        if(err){
            return res.status(403).json({ message: false });
        }
        const newAccessToken = generateAccessToken(memberData);
        return res.cookie('accessToken', newAccessToken,  { expires: new Date(Date.now() + (1 * 60 * 1000)) }).json({ message: true})
    });  
});

const generateAccessToken = (checkedMember) => {
    return jwt.sign({email: checkedMember.email, username: checkedMember.username, _id: checkedMember._id, img: checkedMember.img}, process.env.ACCESS_TOKEN_KEY, { expiresIn: "1m"} )
}

const generateRefreshToken = (checkedMember) => {
    return jwt.sign({email: checkedMember.email, username: checkedMember.username, _id: checkedMember._id, img: checkedMember.img}, process.env.REFRESH_TOKEN_KEY, { expiresIn: "10m"} )
}

app.post('/login', async ( req, res ) => {
    const { email, password } = req.body

    try{
        await connectToDb()

        const checkedMember = await Member.findOne({ email })
        
        if(!checkedMember){
            return res.status(400).json({ message: 'User do not exist'})
        } 

        if(checkedMember.verified === false){
            return res.status(400).json({ data: { userId: checkedMember._id, email}, message: 'User not verify'})
        }
        
        const confirmPassword = await bcrypt.compareSync(password, checkedMember.password) 
        
        if(!confirmPassword){
           return res.status(400).json({ message: "Incorrect password" })
        }

        const accessToken = generateAccessToken(checkedMember)
        const refreshToken = generateRefreshToken(checkedMember)
        
        res.cookie('accessToken', accessToken, { expires: new Date(Date.now() + (1 * 60 * 1000)) });
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true,  sameSite: 'strict', expires: new Date(Date.now() + (10 * 60 * 1000)) });
        return res.status(200).json({
            member: checkedMember,
            message: 'Login successfull',
            login: true
        })
        
    }catch(err){
        console.error('Error during login:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
})

const verify = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      jwt.verify(token, process.env.ACCESS_TOKEN_KEY, (err, memberData) => {
        if (err) {
          return res.status(403).json("Token is not valid!");
        }
  
        req.member = memberData;
        next();
      });
    } else {
      return res.status(401).json("You are not authenticated!");
    }
};

app.get('/usersession', ( req, res ) => {
    const refreshtoken = req.cookies.refreshToken
    if(!refreshtoken){
        return res.status(200).json({ sessionActive: false });
    }
    jwt.verify(refreshtoken, process.env.REFRESH_TOKEN_KEY, (err, memberData) => {
        if(err){
            return res.status(403).json({ message: false });
        } 

        return res.status(401).json({ sessionActive: true, member: memberData });
    });  
})

app.get('/member/:username', async ( req, res ) => {
    const { username } = req.params

    try{
        const member = await Member.findOne({username})
        
        return res.status(200).json(member)
    }catch(err){
        throw new Error("An error occur")
    }
})

app.post('/newblog', async ( req, res ) => {
    const { profile, userId, username, title, image, body } = req.body
    
    try{
        await connectToDb()
        
        let newBlog = await Blog.findOne({ body })

        if(!body){
            return res.json({ message: "Body cannot be empty"})
        }

        if(!newBlog){
            newBlog = await Blog({
                userId,
                username,
                title,
                img: image,
                profile,
                body,
                comments: []
            })
            
            await newBlog.save()
            
            return res.status(201).json({ message: 'Blog posted' })
        }else{
            return res.status(500).json({ message: 'Blog aready exsit' })
        }
    }catch(err){
        console.error('Error during login:', err);
        res.status(500).json({ message: 'Internal server error' });
    } 
})

app.get('/getblogs', async ( req, res ) => {
    try{
        await connectToDb() 
        const blogs = await Blog.find()
        
        return res.status(200).json(blogs)
    }catch(err){
        console.error('Error during login:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
})

app.get('/blog/:id', async ( req, res ) => {
    const { id }  = req.params
    try{
        await connectToDb()
        
        const blogId = await Blog.findOne({ _id: id })
        const comment = await Comment.find({ blogId: id })
        
        return res.status(200).json({ blogId, comment })
    }catch(err){
        return res.status(500).json({ message: " An error occur"})
    }
})

app.post('/deleteblog', verify, async ( req, res ) => {
    const { memberId, blogId } = req.body
    try{
        await connectToDb()
        const blog = await Blog.findOne({_id: blogId})
        const objectId = blog.userId.toHexString()
        
        if(req.member._id != objectId){        
            return res.status(200).json({ message: "Not authorized" })
        }
        await Blog.deleteOne({ _id: blogId})
        await Comment.deleteMany({ blogId }) 
        return res.status(200).json({ message: "Blog deleted"})
    }catch(err){
        return res.status(200).json({ message: "An error occurred"})
    }
})

app.post('/comment', async (req, res) => {
    const { userId, blogId, username, content } = req.body;

    try {
        await connectToDb();

        const comment = await Comment({
            userId,
            blogId,
            username,
            content
        });

        await comment.save()

        return res.status(201).json({ message: 'Comment sent', comment });
    } catch (err) {
        console.error('Error posting comment:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/deleteComment', async ( req, res ) => {
    const { _id } = req.body
    const deletecomment = await Comment.deleteOne({ _id })
    
    res.status(200).json({ message: "Comment deleted"})
})

app.post('/profile', async ( req, res ) => {
    const { userId, img, about, role, link, address } = req.body
    
    try{
        await connectToDb()
        const memberDetail = await Member.findOne({ _id: userId })
        const updateMember = await Member.findOneAndUpdate({ _id: userId }, {
            img: !img ? memberDetail.img : img,
            about: !about ? memberDetail.about : about, 
            role: !role ? memberDetail.role : role, 
            link: !link ? memberDetail.link : link, 
            address: !address ? memberDetail.address : address
        })

        await updateMember.save()

        return res.status(200).json({ message: "Profile updated successfull", updateMember})
    }catch{
        console.error('Error posting comment:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
})

app.listen(PORT, () => {
    console.log(`App is listening at port ${PORT}`)
})

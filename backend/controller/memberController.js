const connectToDb = require('../config/dbConnection')
const Member = require('../model/memberModel')
const Otp = require('../model/otpModel')
const nodemailer = require('nodemailer')
const bcrypt = require('bcryptjs')
const { generateAccessToken, generateRefreshToken } = require('../controller/middleWares')
const { ObjectId } = require('mongodb');
const crypto = require('crypto')

connectToDb()


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

const sendResetLink = async ({ email, resetLink }) => {
    try{
    
        const mailDetails = {
            from: 'emmaranking07@gmail.com',
            to: email,
            subject: "Verify your email",
            html: `<p>Enter your otp ${resetLink} here</p>`
        }

        await transporter.sendMail(mailDetails)

        return {
            staus: "PENDING",
            message: "Verification otp email send",
            // data: {
            //     userId: _id,
            //     email
            // }
        }
    }catch(error){
        return { status: "FAILED", message: error.message }
    }
}

module.exports = {
    verifyOtp: async ( req, res ) => {
        
        const { userId, otp } = req.body
        if( !userId || !otp ){
            return res.json({ status: "FAILED", message: "Invalid Otp" })
        }

        try{
            const otpVerification = await Otp.find({ userId })
    
            if(otpVerification.length <= 0){
                return res.json({ status: "FAILED", message: "Field can't be empty. Input your Otp" })
            }
                
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
            
        }catch(err){
            return res.json({
                status: "FAILED",
                message: err.message
            })
        }
    },

    resendOtp: async ( req, res) => {
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
    },

    createMember:  async ( req, res) => {
        const { img, username, email, password, confirmPassword } = req.body
            
        try{
            await connectToDb()
    
            if(!username || !email || !password || !confirmPassword){
                return res.status(400).json({message: 'All field are mandatory'})
            }
    
            if(password !== confirmPassword){
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
    },

    loginMember: async ( req, res ) => {
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
            res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'lax', expires: new Date(Date.now() + (10 * 60 * 1000)) });
         
            return res.status(200).json({
                member: checkedMember,
                message: 'Login successfull',
                login: true
            })
            
        }catch(err){
            console.error('Error during login:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },

    getMemberByUsername: async ( req, res ) => {
        
        const { username } = req.params 
        try{
            const member = await Member.findOne({username})
            console.log("profile")
            return res.status(200).json(member)
        }catch(err){
            throw new Error("An error occur")
        }
    },

    memberProfile: async ( req, res ) => {
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
    },

    forgetPassword: async (req, res) => {
        const { email } = req.body;
    
        try {
            const existingUser = await Member.findOne({ email });
            
            if (!existingUser) {
                return res.status(404).json({ message: `User doesn't exist.` });
            }
    
            // Generate a reset token
            const resetToken = crypto.randomBytes(32).toString('hex');
            const resetTokenExpires = Date.now() + 3600000; // 1 hour expiration
            const resetLink = `${process.env.CLIENT_URL}resetpassword/${resetToken}`;
            
            // Store token in the OTP model
            await Otp.create({
                userId: existingUser._id,
                otp: resetToken, // Store reset token as OTP
                createdAt: new Date(),
                expiresAt: resetTokenExpires
            });
            // Send reset link via email
            await sendResetLink({email: existingUser.email, resetLink});
    
            return res.status(200).json({ message: 'Password reset link sent to email.' });
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    },
    
    resetPassword: async (req, res) => {
        const { token, newPassword } = req.body;
    
        try {
            const otpEntry = await Otp.findOne({ otp: token });
            if (!otpEntry || otpEntry.expiresAt < Date.now()) {
                return res.status(400).json({ message: 'Invalid or expired token.' });
            }
    
            const user = await Member.findById(otpEntry.userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found.' });
            }
    
            // Hash the new password
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
            await user.save();
    
            // Delete the OTP entry after successful password reset
            await Otp.deleteOne({ _id: otpEntry._id });
    
            return res.status(200).json({ message: 'Password reset successful.' });
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }
    
}
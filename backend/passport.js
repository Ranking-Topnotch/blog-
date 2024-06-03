const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport')
const connectToDb = require('./config/dbConnection')
const Member = require('./model/memberModel')
const jwt = require('jsonwebtoken')

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
    scope: ['email']
  },
  async function(accessToken, refreshToken, profile, cb) {
    try{
      await connectToDb()
      
      let newMember = await Member.findOne({ email: profile._json.email });

      if(!newMember){
        newMember = await Member({
          img: profile.photos[0].value,
          username: profile.name.givenName,
          email: profile._json.email,
        })

        newMember.signInWithGoogle();
      }

      await newMember.save()

      const accessToken = jwt.sign({email: profile._json.email, username: profile.name.givenName, _id: newMember._id, img: newMember.img}, process.env.ACCESS_TOKEN_KEY, { expiresIn: "1m"} )
      const refreshToken = jwt.sign({email: profile._json.email, username: profile.name.givenName, _id: newMember._id, img: newMember.img}, process.env.REFRESH_TOKEN_KEY, { expiresIn: "10m"} )
      console.log(accessToken, refreshToken)
      return cb(null, newMember, { accessToken, refreshToken });
    }catch(err){
      return cb(err);
    }
  }
));

passport.serializeUser((user, done)=>{
    done(null, user)
})

passport.deserializeUser((user, done)=>{
    done(null, user)
})

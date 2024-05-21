const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport')
const connectToDb = require('./config/dbConnection')
const Member = require('./model/memberModel')


const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
    scope: ['email']
  },
  async function(accessToken, refreshToken, profile, cb) {
    console.log(profile.picture)
    console.log(profile.photos[0])
    console.log(profile.photos[0].value)
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

      return cb(null, newMember);
      
    }catch(err){
      return cb(err);
    }
  }
));

passport.serializeUser((user,done)=>{
    done(null,user)
})

passport.deserializeUser((user,done)=>{
    done(null,user)
})
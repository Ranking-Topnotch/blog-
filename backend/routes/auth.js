const router = require('express').Router()
const passport = require('passport')

const CLIENT_URL = process.env.CLIENT_URL

router.get('/login/success', (req, res) => {
    if(req.user){
        res.status(200).json({ 
            user: req.user,  
            message: "login successful", 
            success: true 
        })
    }
})

router.get('/login/failed', (req, res) => {
    res.status(401).json({ 
        message: "login failed", 
        success: false 
    })
})

router.get('/logout', (req, res) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    req.logout(err => {
        if (err) {
            console.error('Error during logout:', err);
            return res.status(500).json({ message: 'Logout failed', success: false });
        }
        console.log('User successfully logged out');
        res.redirect(CLIENT_URL);
    });
})

router.get('/google', passport.authenticate('google', { scope: ["profile", "email"]}))

router.get('/google/callback', (req, res, next) => {
    passport.authenticate('google', (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.redirect('/login/failed');
      }
  
      // Set the cookies with the tokens from the info object
      res.cookie('accessToken', info.accessToken, { expires: new Date(Date.now() + (1 * 60 * 1000)) });
      res.cookie('refreshToken', info.refreshToken, { httpOnly: true, secure: true, sameSite: 'strict', expires: new Date(Date.now() + (10 * 60 * 1000)) });
  
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        return res.redirect(CLIENT_URL);
      });
    })(req, res, next);
  });
// router.get('/google/callback', passport.authenticate('google', {
//     successRedirect: CLIENT_URL,
//     failureRedirect: "/login/failed"
// }))

module.exports = router
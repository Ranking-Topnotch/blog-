const router = require('express').Router()
const passport = require('passport')

const CLIENT_URL = process.env.CLIENT_URL

// router.get("/login/success", (req, res) => {
//   console.log("User session data:", req.user ? "User exists in session" : "No user in session")
//   console.log("Session ID:", req.sessionID)
//   console.log("Cookies received:", req.cookies ? Object.keys(req.cookies) : "No cookies")

//   if (req.user) {
//     console.log("User authenticated, sending success response")
//     res.status(200).json({
//       user: req.user,
//       message: "login successful",
//       success: true,
//     })
//   } else {
//     console.log("User not authenticated, sending 401 response")
//     res.status(401).json({ message: "User not authenticated" })
//   }
// })

router.get("/login/success", (req, res) => {
  // Add CORS headers explicitly for this route
  res.header("Access-Control-Allow-Origin", CLIENT_URL)
  res.header("Access-Control-Allow-Credentials", true)
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS")
  res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept,Authorization")

  console.log("User session data:", req.user ? "User exists in session" : "No user in session")
  console.log("Session user data:", req.session?.user ? "User exists in session.user" : "No user in session.user")
  console.log("Session ID:", req.sessionID)
  console.log("Cookies received:", req.cookies ? Object.keys(req.cookies) : "No cookies")

  // Check both req.user and req.session.user
  const user = req.user || (req.session && req.session.user)

  if (user) {
    console.log("User authenticated, sending success response")
    res.status(200).json({
      user: user,
      message: "login successful",
      success: true,
    })
  } else {
    console.log("User not authenticated, sending 401 response")
    res.status(401).json({ message: "User not authenticated" })
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
        return res.status(200).json({ message: 'User successfully logged out'})
    });

})

router.get('/google', passport.authenticate('google', { scope: ["profile", "email"]}))

// Update the Google callback route
router.get("/google/callback", (req, res, next) => {
  // Add CORS headers explicitly for this route
  res.header("Access-Control-Allow-Origin", CLIENT_URL)
  res.header("Access-Control-Allow-Credentials", true)

  passport.authenticate("google", (err, user, info) => {
    if (err) {
      console.log("Authentication error:", err)
      return next(err)
    }
    if (!user) {
      console.log("No user returned from Google authentication")
      return res.redirect(`${CLIENT_URL}/login?error=auth_failed`)
    }

    // Log tokens to verify they are being received
    console.log("Access Token received:", info.accessToken ? "Token received (hidden for security)" : "No token")
    console.log("Refresh Token received:", info.refreshToken ? "Token received (hidden for security)" : "No token")
    console.log("Token lengths - Access:", info.accessToken?.length, "Refresh:", info.refreshToken?.length)

    // Set the cookies with the tokens from the info object
    res.cookie("accessToken", info.accessToken, {
      expires: new Date(Date.now() + 1 * 60 * 1000),
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    })

    res.cookie("refreshToken", info.refreshToken, {
      expires: new Date(Date.now() + 10 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    })

    // Store user in session
    if (req.session) {
      req.session.user = user
    }

    // Log after setting cookies
    console.log("Cookies set for tokens")
    console.log("Session user set:", req.session?.user ? "User in session" : "No user in session")

    req.logIn(user, (err) => {
      if (err) {
        console.log("Login error:", err)
        return next(err)
      }
      console.log("User successfully logged in, redirecting to:", CLIENT_URL)
      return res.redirect(CLIENT_URL)
    })
  })(req, res, next)
})

// router.get("/google/callback", (req, res, next) => {
//   passport.authenticate("google", (err, user, info) => {
//     if (err) {
//       console.log("Authentication error:", err)
//       return next(err)
//     }
//     if (!user) {
//       console.log("No user returned from Google authentication")
//       return res.redirect("/login/failed")
//     }

//     // Log tokens to verify they are being received
//     console.log("Access Token received:", info.accessToken ? "Token received (hidden for security)" : "No token")
//     console.log("Refresh Token received:", info.refreshToken ? "Token received (hidden for security)" : "No token")
//     console.log("Token lengths - Access:", info.accessToken?.length, "Refresh:", info.refreshToken?.length)

//     // Set the cookies with the tokens from the info object
//     res.cookie("accessToken", info.accessToken, {
//       expires: new Date(Date.now() + 1 * 60 * 1000),
//       secure: process.env.NODE_ENV === "production",
//       sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
//     })

//     res.cookie("refreshToken", info.refreshToken, {
//       expires: new Date(Date.now() + 10 * 60 * 1000),
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
//     })

//     // Log after setting cookies
//     console.log("Cookies set for tokens")

//     req.logIn(user, (err) => {
//       if (err) {
//         console.log("Login error:", err)
//         return next(err)
//       }
//       console.log("User successfully logged in, redirecting to:", CLIENT_URL)
//       return res.redirect(CLIENT_URL)
//     })
//   })(req, res, next)
// })

module.exports = router

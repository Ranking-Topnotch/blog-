const router = require('express').Router()
const memberController = require('../controller/memberController') 

router.post('/register', memberController.createMember)

router.post('/verifyOtp', memberController.verifyOtp)

router.post('/resendOtp', memberController.resendOtp)

router.post('/login', memberController.loginMember)

router.get('/member/:username', memberController.getMemberByUsername)

router.post('/profile', memberController.memberProfile)

router.post('/forgetpassword', memberController.forgetPassword)

router.post('/resetpassword', memberController.resetPassword)




module.exports = router
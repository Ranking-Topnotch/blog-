const router = require('express').Router()
const middleWaresRoute = require('../controller/middleWares')

router.get('/refreshtoken', middleWaresRoute.refreshToken)

router.get('/usersession', middleWaresRoute.userSession)

router.get('/auth/check', middleWaresRoute.verifySession)

router.post('verifyToken', middleWaresRoute.verifyToken)

module.exports = router
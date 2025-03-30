const router = require('express').Router()
const commentRoute = require('../controller/commentController')

router.post('/comment', commentRoute.comment)

router.delete('/deletecomment', commentRoute.deleteComment)

module.exports = router
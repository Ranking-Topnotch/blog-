const router = require('express').Router()
const blogRoute = require('../controller/blogController')


router.get('/getblogs', blogRoute.getBlogs)

router.get('/:id', blogRoute.getBlogById)

router.post('/newblog', blogRoute.newBlog)

router.delete('/deleteblog', blogRoute.deleteBlogById)

router.post('/likes', blogRoute.likeBlog)

module.exports = router
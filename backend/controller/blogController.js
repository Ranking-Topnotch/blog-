const connectToDb = require('../config/dbConnection')
const Comment = require('../model/commentModel')
const Blog = require('../model/blogModel')

connectToDb()
module.exports = {
    newBlog: async ( req, res ) => {
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
    },

    getBlogs: async ( req, res ) => {
        try{
            await connectToDb() 
            
            const timeStamped = new Date(Date.now() - 10 * 60 * 1000)
            
            const topBlog = await Blog.find({ createdAt: { $gte: timeStamped }})
            const randomBlog = await Blog.aggregate([{ $match: { createdAt: { $lt: timeStamped }}}, { $sample: { size: await Blog.countDocuments({ createdAt: { $lt: timeStamped } })}}])
            
            const blogs = [ ...topBlog, ...randomBlog]
       
            return res.status(200).json(blogs)
        }catch(err){
            console.error('Error during login:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },

    getBlogById: async ( req, res ) => {
        const { id }  = req.params
        try{
            await connectToDb()
            
            const blogId = await Blog.findOne({ _id: id })
            const comment = await Comment.find({ blogId: id })
            
            return res.status(200).json({ blogId, comment })
        }catch(err){
            return res.status(500).json({ message: err.message})
        }
    },

    deleteBlogById: async ( req, res ) => {
        console.log("delete")
        const { memberId, blogId } = req.body
        console.log(memberId, blogId)
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
    },

    likeBlog: async ( req, res ) => {
        const { userId, id } = req.body
        try{
            await connectToDb()
            const checkedLike = await Blog.findById({_id: id})
    
            let message = '';
            if(checkedLike.likes.includes(userId)){
                await Blog.findByIdAndUpdate(id, {
                    $pull:{likes: userId}
                })
                
                message = 'Blog Disliked';
            }else{
                await Blog.findByIdAndUpdate(id, {
                    $addToSet:{likes: userId}
                })
    
                message = 'Blog Liked';
            }
    
            const updatedBlog = await Blog.findById({ _id: id });
    
            return res.status(200).json({ message, likes: updatedBlog.likes });
        }catch(err){
            return res.status(500).json({ message: " An error occur"})
        }
    }
}
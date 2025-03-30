const connectToDb = require('../config/dbConnection')
const Comment = require('../model/commentModel')

connectToDb()

module.exports = {
    comment: async ( req, res ) => {
        const { userId, blogId, username, content } = req.body;

        try {
            await connectToDb();

            const comment = await Comment({
                userId,
                blogId,
                username,
                content
            });

            await comment.save()

            return res.status(201).json({ message: 'Comment sent', comment });
        } catch (err) {
            console.error('Error posting comment:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },

    deleteComment: async ( req, res ) => {
        const { _id } = req.body      
        try{
            await Comment.deleteOne({ _id })

            res.status(200).json({ message: "Comment deleted"})
        }catch(err){
            return res.status(500).json({ message: err.message });

        }
        
    }
}
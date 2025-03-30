import { useState, useEffect, useContext } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import Button from "../../component/button/Button"
import TextArea from "../../component/textArea/TextArea"
import { formatDate } from "../../utility/mockData"
import { MdOutlineDeleteSweep } from "react-icons/md";
import { AiOutlineLike } from "react-icons/ai";
import { TfiCommentAlt } from "react-icons/tfi";
import { FaRegShareSquare } from "react-icons/fa";
import refreshToken from '../../component/refreshToken';
import toast from "react-hot-toast";
import styles from "./blogId.module.css"
import Input from "../../component/input/Input"
import { UserContext } from "../../context/UserContext"

const BlogId = () => {
  const navigate = useNavigate()
  const { member } = useContext(UserContext)
  console.log(member)
  const { id } = useParams()
  console.log(id)
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [comments, setComments] = useState([])
  const [ postComment, setPostComment ] = useState({
    userId: '',
    blogId: '',
    username: '',
    content: ''
  })
  console.log(blog)
  
  

  const fetchData = async () => {
        try{
          const res = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/member/blog/${id}`);
          const resData = await res.json();
          console.log(resData.blogId)
          setBlog(resData.blogId);
          setComments(resData.comment)
          setLoading(false)
        }catch(err){
          console.log('Error fetching data:', err);
        }
      }
      useEffect(() => {
        fetchData();
      }, [ id ]);
    
      useEffect(() => {
        if(member._id && id){
          setPostComment(prev => ({
            ...prev,
            userId: member._id,
            blogId: id,
            username: member.username
          }));
        }
      }, [member._id, id]);
    console.log(postComment)
      const handleCommentChange = (e) => {
        const { name, value } = e.target;
    
        setPostComment(prev => ({
          ...prev,
          [name]: value
        }));
      };
    
      //fliping the comment section
      const flipComment = () => {
        setShowComments(prev => !prev);
      };
    
      const goBack = () => {
        navigate(-1); // Go back one step in the history
      };
    
      //commenting
      const handleCommentSubmit = async (e) => {
        e.preventDefault();
        console.log(postComment)
    
        const fetchData = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/membercomment/comment`, {
          method: "POST",
          headers: {
            "content-type": "application/json"
          },
          body: JSON.stringify(postComment)
        });
    
        const resData = await fetchData.json()
    
        if(resData.message === "Comment sent"){
          toast(<p className={styles.alert}>{resData.message}</p>)
         
          setComments(prevComments => [...prevComments, resData.comment])
    
          setShowComments(false)
        }else{
          toast(<p className={styles.alert}>{resData.message}</p>) 
        } 
      };
    
      const likePost = async () => {
        console.log({ userId: member._id, id })
        const fetchData = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/member/blog/likes`, {
          method: "POST",
          headers: {
            "content-type": "application/json"
          },
          body: JSON.stringify({ userId: member._id, id })
        });
    
        const resData = await fetchData.json()
         
        if(resData.message === "Blog Liked"){
          toast(<p className={styles.alert}>{resData.message}</p>)
          setBlog(prevBlog => ({...prevBlog, likes: resData.likes }))
        }else if(resData.message === "Blog Disliked"){
          toast(<p className={styles.alert}>{resData.message}</p>) 
          setBlog(prevBlog => ({...prevBlog, likes: resData.likes }))
        }
      }
    
      const deleteBlog = async (memberId, blogId) => {
        await refreshToken()
        const accessToken = `; ${document.cookie}`.split(`; accessToken=`).pop().split(';').shift();
          const fetchData = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/member/deleteblog`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify({
              memberId, 
              blogId
            })
        })
    
        const resData = await fetchData.json()
        
        if(resData.message === "Blog deleted"){
          toast(<p className={styles.alert}>{resData.message}</p>)
          navigate('/blog')
        }else if(resData.message === "Not authorized"){
          toast(<p className={styles.alert}>{resData.message}</p>)
        } 
      }
    
      const deleteComment = async ( _id ) => {
        const fetchData = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/membercomment/deletecomment`, {
          method: "DELETE",
          headers: {
              "content-type": "application/json"
          },
          body: JSON.stringify({
            _id
          })
      })
    
      const resData = await fetchData.json()
      
      if(resData.message === "Comment deleted"){
        toast(<p className={styles.alert}>{resData.message}</p>)
        setComments(comments.filter(e => e._id !== _id))
      } 
    }

  if (loading) {
    return (
      <div className="container">
        <div className={styles.loading}>Loading blog...</div>
      </div>
    )
  }

  return (
    <div className={styles.blogDetailPage}>
      <div className="container">
        <div className={styles.backLink}>
          <Link to="/blog">&larr; Back to blogs</Link>
        </div>

        <article className={styles.blogArticle}>
          <header className={styles.blogHeader}>
            <div>
              <h1 className={styles.blogTitle}>{blog.title}</h1>
              <MdOutlineDeleteSweep onClick={deleteBlog} className={styles.deleteButton}/>
            </div>
            <div className={styles.authorInfo}>
              <div className={styles.avatar}>
                <img src={blog.profile || "/placeholder.svg"} alt={blog.username} />
              </div>
              <div className={styles.authorDetails}>
                <h3 className={styles.authorName}>{blog.username}</h3>
                <p className={styles.date}>{formatDate(blog.createdAt)}</p>
              </div>
            </div>
          </header>

          {blog.img && (
            <div className={styles.blogImage}>
              <img src={blog.img || "/placeholder.svg"} alt={blog.title} />
            </div>
          )}

          <div className={styles.blogContent}>
            <p>{blog.body}</p>
            {/* In a real app, you would render the full blog content here */}
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
              ea commodo consequat.
            </p>
            <p>
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
              laborum.
            </p>
            <h2>Key Takeaways</h2>
            <ul>
              <li>First important point about the topic</li>
              <li>Second key insight that readers should remember</li>
              <li>Final thought to conclude the article</li>
            </ul>
          </div>

          <div className={styles.blogActions}>
            <button className={`${styles.actionButton} ${liked ? styles.liked : styles.disliked}`} onClick={likePost}>
            { blog.likes.includes(member._id) ? <AiOutlineLike onClick={likePost} className={styles.like}/> : <AiOutlineLike onClick={likePost} className={styles.dislike}/>}
              {/* <AiOutlineLike className={liked ? styles.liked : ""}/> */}
              <span>{blog.likes.length}</span>
            </button>
            <button className={styles.actionButton} onClick={() => setShowComments(!showComments)}>
              <TfiCommentAlt className="fas fa-comment" />
              <span>{comments.length}</span>
            </button>
            <button className={styles.actionButton}>
              <FaRegShareSquare className="fas fa-share"/>
              <span>Share</span>
            </button>
          </div>

          {showComments && (
            <div className={styles.commentsSection}>
              <h3 className={styles.commentsTitle}>Comments ({comments.length})</h3>

              <form onSubmit={handleCommentSubmit} className={styles.commentForm}>
                <Input 
                  placeholder="UserID"
                  name='userId'
                  value={postComment.userId} 
                  onChange={handleCommentChange}
                  hidden={true}
                />
                <Input 
                  placeholder="Blog Id"
                  name='blogId'
                  value={postComment.blogId} 
                  onChange={handleCommentChange}
                  hidden
                />
                <Input 
                  placeholder="Devloper Username"
                  name='username'
                  value={postComment.username} 
                  onChange={handleCommentChange}
                  hidden
                />
                <TextArea
                  placeholder="Add a comment..."
                  name='content'
                  value={postComment.content}
                  onChange={handleCommentChange}
                  rows={3}
                />
                <Button type="submit" disabled={!postComment.content.trim()}>
                  Post Comment
                </Button>
              </form>

              <div className={styles.commentsList}>
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment._id} className={styles.comment}>
                      <div >
                        <div className={styles.commentHeader}>
                          <div className={styles.commentAvatar}>
                            <img src={comment.profile || "/placeholder.svg"} alt={comment.username} />
                          </div>
                          <div className={styles.commentAuthor}>
                            <h4>{comment.username}</h4>
                            {/* <p>{formatDate(comment.createdAt)}</p> */}
                          </div>
                        </div>
                        <MdOutlineDeleteSweep className={styles.deleteButton} onClick={() => deleteComment(comment._id)}/> 
                      </div> 
                        <p className={styles.commentText}>{comment.content}</p>
                    </div>
                  ))
                ) : (
                  <p className={styles.noComments}>No comments yet. Be the first to comment!</p>
                )}
              </div>
            </div>
          )}
        </article>
      </div>
    </div>
  )
}

export default BlogId



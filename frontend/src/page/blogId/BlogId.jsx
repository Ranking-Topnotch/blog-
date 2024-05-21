import style from './blogId.module.css'
import { GiCoinsPile, GiSelfLove } from "react-icons/gi";
import { BiRepost, BiComment } from "react-icons/bi";
import { MdDeleteOutline } from "react-icons/md"
import { IoMdArrowRoundBack } from "react-icons/io";
import toast from "react-hot-toast";
import React, { useState, useEffect } from 'react'
import Comment from '../../component/comment/Comment';
import Avatar from '../../assest/noavatar.png'
import refreshToken from '../../component/refreshToken';
import { Link, useNavigate, useParams } from 'react-router-dom';

const  BlogId = ({ member }) => {
  
  const [ blog, setBlog ] = useState(null);
  const [ comment, setComment ] = useState(null)
  const [ isLoading, setIsLoading ] = useState(true);
  const [ comInput, setComInput ] = useState(false);
  const [ postComment, setPostComment ] = useState({
    userId: '',
    blogId: '',
    username: '',
    content: ''
  });
  
  const { id } = useParams();
  const navigate = useNavigate()
  console.log(blog)

  // fetching the blog by id that come's from params

  const fetchData = async () => {
    try{
      const res = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/blog/${id}`);
      const resData = await res.json();
      setBlog(resData.blogId);
      setComment(resData.comment)
      setIsLoading(false)
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

  const handleCommentChange = (e) => {
    const { name, value } = e.target;

    setPostComment(prev => ({
      ...prev,
      [name]: value
    }));
  };

  //fliping the comment section
  const flipComment = () => {
    setComInput(prev => !prev);
  };

  const goBack = () => {
    navigate(-1); // Go back one step in the history
  };

  //commenting
  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    const fetchData = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/comment`, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(postComment)
    });

    const resData = await fetchData.json()

    if(resData.message === "Comment sent"){
      toast(<p className={style.alert}>{resData.message}</p>)
     
      setComment(prevComments => [...prevComments, resData.comment])

      setComInput(false)
    }else{
      toast(<p className={style.alert}>{resData.message}</p>) 
    } 
  };

  const deleteBlog = async (memberId, blogId) => {
    await refreshToken()
    const accessToken = `; ${document.cookie}`.split(`; accessToken=`).pop().split(';').shift();
    console.log(accessToken)
      const fetchData = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/deleteblog`, {
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
      toast(<p className={style.alert}>{resData.message}</p>)
      navigate('/blog')
    }else if(resData.message === "Not authorized"){
      toast(<p className={style.alert}>{resData.message}</p>)
    } 
  }

  const deleteComment = async ( _id ) => {
    const fetchData = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/deletecomment`, {
      method: "POST",
      headers: {
          "content-type": "application/json"
      },
      body: JSON.stringify({
        _id
      })
  })

  const resData = await fetchData.json()
  
  if(resData.message === "Comment deleted"){
    toast(<p className={style.alert}>{resData.message}</p>)
    setComment(comment.filter(e => e._id !== _id))
  } 
}

  return (
    <div className={style.blogId}>
      {isLoading ? (
        <p>Loading</p>
      ) : (
        <div key={blog._id} className={style.blog_con}>
          
          <div className={style.blogcon}>
            <div className={style.imgcon}>
              
              <Link onClick={goBack} className={style.back}>< IoMdArrowRoundBack /> </Link>
              <img src={blog.img} height={500} width={300} />
            </div>

            <div className={style.blog_id}>
              <div>
                <div className={style.usercon}>
                  <div>
                    <img className={style.user} src={Avatar} alt='blodID' height={20} width={20} />
                    <p className={style.username}>{blog.username}</p>
                  </div>
                  
                  { member._id === blog.userId && <p> <MdDeleteOutline className={style.delete} onClick={() => deleteBlog(member._id,  blog._id)}/> </p>}
                </div>

                <h1 className={style.head}>{blog.title}</h1>
                <p className={style.date}>2024 May 10</p>

                <p className={style.body}>{blog.body}</p>
              </div>

              <div className={style.interact}>
                <GiSelfLove className={style.like}/>
                <BiComment onClick={flipComment} className={style.comment}/>
                <BiRepost className={style.repost}/>
              </div>
            </div>

          </div>

          <div className={style.commentInput}>
            
            { comInput && <form onSubmit={handleCommentSubmit}>
              <input type={'text'} placeholder='userId' name='userId' value={postComment.userId} hidden />
              <input type={'text'} placeholder='blogId' name='blogId' value={postComment.blogId} hidden />
              <input type={'text'} placeholder='userId' name='username' value={postComment.username} hidden />
              <textarea placeholder='A penny for your thought' name='content' value={postComment.content} onChange={handleCommentChange} className={style.text} autoFocus/>
              <button className={style.button}>Comment</button>
            </form>}
            
            <Comment comment={comment} deleteComment={deleteComment} /> 
          </div>
        </div>
      )}
    </div>  
  );
};

export default BlogId;

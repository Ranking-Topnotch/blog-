import React, { useEffect, useState } from 'react'
import style from './profile.module.css'
import ProfileImage from '../../assest/noavatar.png'
import { CiCalendarDate } from "react-icons/ci";
import { FaLocationDot } from "react-icons/fa6";
import { LiaCriticalRole } from "react-icons/lia";
import { IoIosLink } from "react-icons/io";
import { ImCancelCircle } from "react-icons/im";
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from "react-hot-toast";
import Avatar from '../../assest/noavatar.png';

const Profile = ({ member }) => {
    const [ blogs, setBlogs ] = useState('')
    const [ singleMember, setSingleMember ] = useState('')
    const [ profile, setProfile ] = useState({
      userId: member._id,
      about: '',
      role: '',
      link: '',
      address: ''
    })
    const [ isLoading, setIsLoading ] = useState(true)
    const [ buttonFlip, setButtonFlip ] = useState(false)
    const navigate = useNavigate()
    const { username} = useParams()

    const handleProfileChange = (e) => {
      const { name, value } = e.target

      setProfile(prev => {
       return {
        ...prev,
        [ name ] :  value
       }
      })
    }

    const handleFormSubmit = async ( e ) => {
      e.preventDefault()

      const fetchData = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/profile`, {
        method: "POST",
        credentials: "include",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify(profile)
      })

      const resData = await fetchData.json()

      if(resData.message === "Profile updated successfull"){
        toast(resData.message)
        setButtonFlip(false)
      }

    }
    
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/getblogs`);
      const resData = await res.json();
      const filterBlog = resData.filter( e => e.username === username)
      setBlogs(filterBlog);
      setIsLoading(false);
    };

    const fetchMember = async () => {
      const res = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/member/${username}`);
      const resData = await res.json();
      setSingleMember(resData);
    };

    fetchData();
    fetchMember();
  }, [ username]);

  const handleButtonFlip = () => {
    setButtonFlip(prev => !prev)
  }

  const goBack = () => {
    navigate(-1); 
  };

  return (
    <div className={style.profileHead}>
        <div >
            <div className={style.avatar_con}>
                <img src={ blogs.img ? blogs.img : ProfileImage  } alt='Img' className={style.avatar} height={100} width={100}/>
                { singleMember._id === member._id &&  <button className={style.editButton} onClick={handleButtonFlip}> Edit profile</button>}
            </div>

            { buttonFlip && <div className={style.button_con}>
              <section>
                <p className={style.close} onClick={handleButtonFlip}> < ImCancelCircle /> </p>
                <form onSubmit={handleFormSubmit}>
                    <input type={'text'} name='userId' value={profile.userId} readonly hidden/>
                    <textarea type={'text'} placeholder='about me' name='about' value={profile.about} onChange={handleProfileChange} className={style.profileInput}/>
                    <input type={'text'} placeholder='role' name='role' value={profile.role} onChange={handleProfileChange}/>
                    <input type={'text'} placeholder='website link' name='link' value={profile.link} onChange={handleProfileChange}/>
                    <input type={'text'} placeholder='address' name='address' value={profile.address} onChange={handleProfileChange}/>

                    <button>Submit</button>
                </form>
              </section> 
            </div> }

            <h4>{ username }</h4>
            <p className={style.about} >About Me</p>
            <div className={style.aboutDetail}>
              <p> <LiaCriticalRole /> <span>{ singleMember.role ? singleMember.role : "" }</span></p>
              <p> <IoIosLink /> <span>{ singleMember.link ? singleMember.link : "" }</span></p>
              <p>< CiCalendarDate /> <span>Joined by </span></p>
              <p>< FaLocationDot /> <span>{ singleMember.address ? singleMember.address : "" }</span></p>
            </div>
        </div>
        
        <div className={style.blogcontain}>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        blogs.map((e) => (
          <div className={style.blogcon} key={e._id}>
            <div className={style.imgcon}>
              <img src={e.img} alt="blogpage" height={200} width={200} />
            </div>
            <div className={style.blog}>
              <div className={style.usercon}>
                <img className={style.user} src={Avatar} alt="blogpage" height={20} width={20} />
                <p className={style.username}>{e.username}</p>
              </div>
              <h1 className={style.head}>{e.title}</h1>
              <p className={style.date}>{e.createdAt}</p>
              <p className={style.body}>{e.body}</p>
              <Link to={`/blog/${e._id}`} className={style.link}>Read more</Link>
            </div>
          </div>
        ))
      )}
    </div>
    
    </div>
  )
}

export default Profile
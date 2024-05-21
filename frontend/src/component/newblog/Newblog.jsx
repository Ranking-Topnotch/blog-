import React, { useEffect, useState } from 'react'
import { ImageUtility } from '../../utility/ImageUtility'
import Avatar from '../../assest/noavatar.png'
import style from './newblog.module.css'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const Newblog = ({ member }) => {
    const [ userIdLoaded, setUserIdLoaded ] = useState(false)
    const [ newPost, setNewPost ] = useState({
        profile: '',
        userId: '',
        username: '',
        title: '',
        image: '',
        img: '',
        body: ''
    })
    console.log(newPost)
    const navigate = useNavigate()

    useEffect( () => {
        if(member._id){
            setNewPost(( prev ) => ({
                ...prev,
                profile: member.img,
                userId: member._id,
                username: member.username
            }))

            setUserIdLoaded(true)
        }
    }, [ member._id ])

    const handlePostChange = ( e ) => {
        const { name, value } = e.target

        setNewPost(( prev ) => {

            return{
                ...prev,
                [ name ]: value
            }
        })
    }

    const uploadImage = async (type) => {
        let data = new FormData()
        data.append("file", type === 'image' ? newPost.img : '')
        data.append("upload_preset", type === 'image' ? 'images_preset' : '')  
    
        try{
            let cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
            let resourceType = type === 'image' ? newPost.img : 'video';
            let api = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
        
            const fetchData = await fetch(api, {
                method: "POST",
                body: data
            })

            const res = await fetchData.json()
            console.log(res.secure_url)
            return res.secure_url
        }catch(err){
            console.log(err)
        }
    }

    const handlePostImage = async(e) => {
        const data = await ImageUtility(e.target.files[0])

        setNewPost((prev) => {
            return{
                ...prev,
                image: data,
                img: e.target.files[0]
            }
        })
    }

    const handlePostSubmit = async (e) => {
        e.preventDefault()
            const imgUrl = await uploadImage('image');
            setNewPost((prev) => ({
                ...prev,
                image: imgUrl
            }));
    
            const fetchData = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/newblog`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ...newPost,
                    image: imgUrl 
                })
            });
    
        const resData = await fetchData.json()

        if(resData.message === "Blog posted"){
            toast(<p className={style.alert}>{resData.message}</p>)
            navigate('/blog')
        }else{
            toast(<p className={style.alert}>{resData.message}</p>) 
        }
    }

  return (
    <div className={style.postHead}>
        <h3>What do you have for us?</h3>
        { userIdLoaded && <form className={style.form} onSubmit={handlePostSubmit}> 
            <input type={'text'} placeholder='userId' name='userId' value={newPost.userId} readOnly hidden />
            <input type={'text'} placeholder='profile' name='profile' value={newPost.profile} readOnly hidden />
            <input type={'text'} placeholder='username' name='username' value={newPost.username} readOnly hidden />
            <input type={'text'} placeholder='Blog title' name='title' value={newPost.title} onChange={handlePostChange}/>
            <label htmlFor='image'>
                <div className={style.imageSec}>
                    { newPost.image ? <img className={style.blogImage} src={newPost.image} alt='blog' height={20} width={20} /> : <img className={style.blogImage} src={Avatar} alt='blog' height={20} width={20} />}
                    <input id='image' className={style.imageUpload} type={'file'} placeholder="image" accept="image/*"  name="image" onChange={handlePostImage} hidden/>
                </div>
            </label> 
            <textarea className={style.blogInput} type={'text'} placeholder='About the topic' name='body' value={newPost.body} onChange={handlePostChange} />
            <input id='image' type={'file'} placeholder="image" accept="image/*" name="img" onChange={handlePostImage} hidden/>
            <button type={'submit'}>Post</button>
        </form>}
    </div>
  )
}

export default Newblog
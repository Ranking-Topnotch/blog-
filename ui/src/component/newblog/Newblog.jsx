import { useState, useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Button from "../../component/button/Button"
import Input from "../../component/input/Input"
import TextArea from "../../component/textArea/TextArea"
import { ImageUtility } from '../../utility/ImageUtility'
import styles from "./newblog.module.css"
import { UserContext } from "../../context/UserContext"
import Avatar from '../../assest/noavatar.png'
import toast from 'react-hot-toast'

const NewBlog = () => {
  const { member } = useContext(UserContext)
  const [ userIdLoaded, setUserIdLoaded ] = useState(false)

  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    userId: '',
    profile: '',
    username: '',
    title: '',
    image: '',
    img: '',
    body: ''
  })
  const [errors, setErrors] = useState({})

  useEffect( () => {
      if(member._id){
          setFormData(( prev ) => ({
              ...prev,
              profile: member.img,
              userId: member._id,
              username: member.username
          }))

          setUserIdLoaded(true)
      }
  }, [ member._id ])
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title) {
      newErrors.title = "Title is required"
    }

    if (!formData.body) {
      newErrors.body = "Blog content is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const uploadImage = async (type) => {
    let data = new FormData()
    data.append("file", type === 'image' ? formData.img : '')
    data.append("upload_preset", type === 'image' ? 'images_preset' : '')  

    try{
        let cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
        let resourceType = type === 'image' ? formData.img : 'video';
        let api = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    
        const fetchData = await fetch(api, {
            method: "POST",
            body: data
        })

        const res = await fetchData.json()
        return res.secure_url
    }catch(err){
        console.log(err)
    }
}

const handlePostImage = async(e) => {
    const data = await ImageUtility(e.target.files[0])

    setFormData((prev) => {
        return{
            ...prev,
            image: data,
            img: e.target.files[0]
        }
    })
}

  const handleSubmit = async(e) => {
    e.preventDefault()

    if (validateForm()) {
      const imgUrl = await uploadImage('image');
      
      setFormData((prev) => ({
          ...prev,
          image: imgUrl
      }));
      const fetchData = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/member/blog/newblog`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({
              ...formData,
              image: imgUrl 
          })
      });

      const resData = await fetchData.json()

      if(resData.message === "Blog posted"){
          toast(<p className={styles.alert}>{resData.message}</p>)
          navigate('/blog')
      }else{
          toast(<p className={styles.alert}>{resData.message}</p>) 
      }
    }
  }

  const handleSaveDraft = () => {
  
    console.log("Draft saved:", formData)
    alert("Draft saved successfully!")
  }

  return (
    <div className={styles.postBlogPage}>
      <div className="container">
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Create a New Blog Post</h1>
          <p className={styles.pageSubtitle}>Share your knowledge and experiences with the developer community</p>
        </div>

        <div className={styles.formCard}>
          <div className={styles.authorInfo}>
            <div className={styles.avatar}>
              <img src={member.img || "/placeholder.svg"} alt={member.username} />
            </div>
            <div className={styles.authorDetails}>
              <h3 className={styles.authorName}>{member.username}</h3>
              <p className={styles.authorRole}>{member.role}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <Input
              label="Blog Title"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter a descriptive title"
              error={errors.title}
              required
            />

            <label htmlFor='image'>
               <div className={styles.imageSec}>
                  { formData.image ? <img className={styles.blogImage} src={formData.image} alt='blog' height={20} width={20} /> : <img className={styles.blogImage} src={Avatar} alt='blog' height={20} width={20} />}
                   <input id='image' className={styles.imageUpload} type={'file'} placeholder="image" accept="image/*"  name="image" onChange={handlePostImage} hidden/>
               </div>
           </label> 

            <TextArea
              label="Blog Content"
              id="body"
              name="body"
              value={formData.body}
              onChange={handleChange}
              placeholder="Write your blog content here..."
              rows={10}
              error={errors.body}
              required
            />

            <div className={styles.formActions}>
              <Button type="button" variant="outline" onClick={handleSaveDraft}>
                Save as Draft
              </Button>
              <Button type="submit">Publish Post</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default NewBlog


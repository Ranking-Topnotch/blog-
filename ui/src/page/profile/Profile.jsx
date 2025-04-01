import { useState, useEffect, useContext } from "react"
import { Link, useParams } from "react-router-dom"
import Button from "../../component/button/Button"
import Input from "../../component/input/Input"
import TextArea from "../../component/textArea/TextArea"
import Modal from "../../component/modal/Modal"
import BlogCard from "../../component/blogCard/BlogCard"
import { mockUser, mockBlogs } from "../../utility/mockData"
import toast from "react-hot-toast";
import styles from "./profile.module.css"
import { UserContext } from "../../context/UserContext"
import Avatar from '../../assest/noavatar.png'
import { ImageUtility } from '../../utility/ImageUtility'


const Profile = () => {
  const { username} = useParams()
  const { member } = useContext(UserContext)
  const [user, setUser] = useState('')
  const [userBlogs, setUserBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("posts")
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    userId: member?._id || '',
    image: '', 
    img: member?.img || '',
    about: member?.about || '',
    role: member?.role || '',
    link: member?.link || '',
    address: member?.address || ''
  })


  useEffect(() => {
     const fetchData = async () => {
      const res = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/member/blog/getblogs`);
      const resData = await res.json();
      const filterBlog = resData.filter( e => e.username === username)
      setUserBlogs(filterBlog);
      setLoading(false);
    };

    const fetchMember = async () => {
      if (!username) return;
      const res = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/member/${username}`);
      const resData = await res.json();
      
      setUser(resData);
      setFormData({
        userId: resData._id,
        img: resData.img || '', //edited
        about: resData.about || '',
        role: resData.role || '',
        link: resData.link || '',
        address: resData.address || ''
      });
      setLoading(false);
    }
    fetchData();
    fetchMember();
  }, [ username ])

 useEffect(() => {
  if (user && member) {  
    setFormData({
      userId: member?._id || '',
      img: user.img || "", //edited
      about: user.about || "",
      role: user.role || "",
      link: user.link || "",
      address: user.address || "",
    })
  }
}, [user, member])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
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

  const handleSubmit = async (e) => {
    e.preventDefault()

    const imgUrl = await uploadImage('image');
    const updatedProfile = {
        ...user,
        ...formData, 
        image: imgUrl
    };

    const fetchData = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/profile`, {
      method: "POST",
      credentials: "include",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(updatedProfile)
    })

    const resData = await fetchData.json()

    if(resData.message === "Profile updated successfull"){
      setUser(updatedProfile);
      toast(resData.message)
      setIsEditModalOpen(false)
    }

    // Update local user state
    setUser((prev) => ({ ...prev, ...formData, img: formData.image }))

    // Close modal
    
  }

  if (loading) {
    return (
      <div className="container">
        <div className={styles.loading}>Loading profile...</div>
      </div>
    )
  }

  return (
    <div className={styles.profilePage}>
      <div className="container">
        <div className={styles.profileHeader}>
          <div className={styles.profileCover}></div>
          <div className={styles.profileInfo}>
            <div className={styles.profileAvatar}>
              <img src={user.img || "/placeholder.svg"} alt={user.username} />
            </div>
            <div className={styles.profileDetails}>
              <h1 className={styles.profileName}>{user.username}</h1>
              <p className={styles.profileRole}>{user.role}</p>
            </div>
            <div className={styles.profileActions}>
              <Button onClick={() => setIsEditModalOpen(true)}>
                <i className="fas fa-edit"></i>
                Edit Profile
              </Button>
            </div>
          </div>
        </div>

        <div className={styles.profileContent}>
          <div className={styles.profileSidebar}>
            <div className={styles.profileCard}>
              <h2 className={styles.cardTitle}>About</h2>
              <p className={styles.aboutText}>{user.about}</p>

              <div className={styles.profileMeta}>
                {user.address && (
                  <div className={styles.metaItem}>
                    <i className="fas fa-map-marker-alt"></i>
                    <span>{user.address}</span>
                  </div>
                )}

                {user.link && (
                  <div className={styles.metaItem}>
                    <i className="fas fa-link"></i>
                    <a href={user.link} target="_blank" rel="noopener noreferrer">
                      {(user.link || "").replace(/^https?:\/\//, "")}
                    </a>
                  </div>
                )}

                <div className={styles.metaItem}>
                  <i className="fas fa-calendar-alt"></i>
                  <span>Joined January 2023</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.profileMain}>
            <div className={styles.tabs}>
              <button
                className={`${styles.tabButton} ${activeTab === "posts" ? styles.active : ""}`}
                onClick={() => setActiveTab("posts")}
              >
                Posts
              </button>
              <button
                className={`${styles.tabButton} ${activeTab === "likes" ? styles.active : ""}`}
                onClick={() => setActiveTab("likes")}
              >
                Likes
              </button>
              <button
                className={`${styles.tabButton} ${activeTab === "comments" ? styles.active : ""}`}
                onClick={() => setActiveTab("comments")}
              >
                Comments
              </button>
            </div>

            <div className={styles.tabContent}>
              {activeTab === "posts" && (
                <>
                  <div className={styles.tabHeader}>
                    <h2 className={styles.tabTitle}>Your Blog Posts</h2>
                    <Link to="/post-blog">
                      <Button>
                        <i className="fas fa-plus"></i>
                        Create New Post
                      </Button>
                    </Link>
                  </div>

                  {userBlogs.length > 0 ? (
                    <div className={styles.blogGrid}>
                      {userBlogs.map((blog) => (
                        <BlogCard key={blog._id} blog={blog} />
                      ))}
                    </div>
                  ) : (
                    <div className={styles.emptyState}>
                      <p>You haven't created any blog posts yet.</p>
                      <Link to="/post-blog">
                        <Button>Create Your First Post</Button>
                      </Link>
                    </div>
                  )}
                </>
              )}

              {activeTab === "likes" && (
                <div className={styles.emptyState}>
                  <p>Posts you've liked will appear here.</p>
                </div>
              )}

              {activeTab === "comments" && (
                <div className={styles.emptyState}>
                  <p>Your comments on posts will appear here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Profile">
        <form onSubmit={handleSubmit} className={styles.editForm}>
          {/* <Input
            label="Profile Image URL"
            id="img"
            name="img"
            value={formData.img}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
          /> */}

          <label htmlFor='image'>
            <div className={styles.imageSec}>
              { formData.img ? <img className={styles.blogImage} src={formData.image ? formData.image : formData.img } alt='blog' height={20} width={20} /> : <img className={styles.blogImage} src={Avatar} alt='blog' height={20} width={20} />}
                <input id='image' className={styles.imageUpload} type={'file'} placeholder="image" accept="image/*"  name="image" onChange={handlePostImage} hidden/>
            </div>
          </label> 

          <TextArea
            label="About"
            id="about"
            name="about"
            value={formData.about}
            onChange={handleChange}
            placeholder="Tell us about yourself"
            rows={4}
          />

          <Input
            label="Role"
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            placeholder="e.g. Senior Developer"
          />

          <Input
            label="Website"
            id="link"
            name="link"
            value={formData.link}
            onChange={handleChange}
            placeholder="https://yourwebsite.com"
          />

          <Input
            label="Location"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="e.g. San Francisco, CA"
          />

          <div className={styles.modalActions}>
            <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Profile


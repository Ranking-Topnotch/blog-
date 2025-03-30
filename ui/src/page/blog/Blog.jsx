import { useState, useEffect, useContext } from "react"
import BlogCard from "../../component/blogCard/BlogCard"
import styles from "./blog.module.css"

const Blog = () => {
  const [blogs, setBlogs] = useState([])
  const [isLoading, setIsLoading] = useState(true)


  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/member/blog/getblogs`);
      const resData = await res.json();
      console.log(resData)
      setBlogs(resData);
      setIsLoading(false);
    };

    fetchData();
        
  }, [])

  return (
    <div className={styles.blogPage}>
      <div className="container">
        <div className={styles.header}>
          <h1 className={styles.title}>Developer Blogs</h1>
          <p className={styles.subtitle}>Discover insights, tutorials, and experiences from fellow developers</p>
        </div>

        {isLoading ? (
          <div className={styles.loading}>Loading blogs...</div>
        ) : (
          <div className={styles.blogGrid}>
            {blogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Blog


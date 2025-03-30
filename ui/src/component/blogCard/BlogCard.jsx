import { Link } from "react-router-dom"
import styles from "./blogCard.module.css"

const BlogCard = ({ blog }) => {
  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Truncate text
  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + "..."
  }

  return (
    <div className={styles.blogCard}>
      {blog.img && (
        <div className={styles.imageContainer}>
          <img src={blog.img || "/placeholder.svg"} alt={blog.title} className={styles.image} />
        </div>
      )}
      <div className={styles.content}>
        <div className={styles.authorInfo}>
          <div className={styles.avatar}>
            <img src={blog.profile || "/placeholder-avatar.jpg"} alt={blog.username} />
          </div>
          <div className={styles.authorDetails}>
            <h4 className={styles.authorName}>{blog.username}</h4>
            <p className={styles.date}>{formatDate(blog.createdAt)}</p>
          </div>
        </div>
        <h2 className={styles.title}>{blog.title}</h2>
        <p className={styles.excerpt}>{truncateText(blog.body, 150)}</p>
        <Link to={`/blog/${blog._id}`} className={styles.readMore}>
          Read more
        </Link>
      </div>
    </div>
  )
}

export default BlogCard


import { useContext, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import styles from "./nav.module.css"
import { UserContext } from "../../context/UserContext"
import { UseIsAuthenticated } from "../../context/UseIsAuthenticated"

const Nav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const { member, logout } = useContext(UserContext)
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          DevBlog
        </Link>

        <button className={styles.menuButton} onClick={toggleMenu} aria-label="Toggle menu">
          <span className={styles.menuIcon}></span>
        </button>

        <nav className={`${styles.nav} ${isMenuOpen ? styles.active : ""}`}>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <Link
                to="/"
                className={`${styles.navLink} ${location.pathname === "/" ? styles.active : ""}`}
                onClick={closeMenu}
              >
                Home
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link
                to="/blog"
                className={`${styles.navLink} ${location.pathname === "/blog" ? styles.active : ""}`}
                onClick={closeMenu}
              >
                Blogs
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link
                to="/contact"
                className={`${styles.navLink} ${location.pathname === "/contact" ? styles.active : ""}`}
                onClick={closeMenu}
              >
                Contact
              </Link>
            </li>
          {/* isAuthenticated */}
            {member ? (
              <>
                <li className={styles.navItem}>
                  <Link
                    to="/newblog"
                    className={`${styles.navLink} ${location.pathname === "/newblog" ? styles.active : ""}`}
                    onClick={closeMenu}
                  >
                    Post Blog
                  </Link>
                </li>
                <li className={styles.navItem}>
                  <Link
                    to={`/profile/${member.username}`}
                    className={`${styles.navLink} ${location.pathname === `/profile/${member.username}` ? styles.active : ""}`}
                    onClick={closeMenu}
                  >
                    Profile
                  </Link>
                </li>
                <li className={styles.navItem} onClick={closeMenu}>
                  <button className={styles.logoutButton} onClick={logout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className={styles.navItem}>
                  <Link
                    to="/login"
                    className={`${styles.navLink} ${location.pathname === "/login" ? styles.active : ""}`}
                    onClick={closeMenu}
                  >
                    Login
                  </Link>
                </li>
                <li className={styles.navItem}>
                  <Link
                    to="/register"
                    className={`${styles.navButton} ${location.pathname === "/register" ? styles.active : ""}`}
                    onClick={closeMenu}
                  >
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Nav


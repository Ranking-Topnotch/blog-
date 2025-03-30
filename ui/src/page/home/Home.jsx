import { Link } from "react-router-dom"
import Button from "../../component/button/Button"
import styles from "./home.module.css"


const HomePage = () => {

  return (
    <div className={styles.homePage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <div className={styles.heroText}>
              <h1 className={styles.heroTitle}>Share Your Developer Journey</h1>
              <p className={styles.heroSubtitle}>
                Connect with other developers, share your knowledge, and grow your network with our developer-focused
                blogging platform.
              </p>
              <div className={styles.heroCta}>
                <Link to="/signup">
                  <Button variant="primary">Get Started</Button>
                </Link>
                <Link to="/blog">
                  <Button variant="outline">Explore Blogs</Button>
                </Link>
              </div>
            </div>
            <div className={styles.heroImage}>
              <img src="https://via.placeholder.com/600x400?text=Developer+Blog" alt="Developer blogging platform" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Why Choose DevBlog?</h2>
            <p className={styles.sectionSubtitle}>
              Our platform is built by developers, for developers. Share your knowledge, learn from others, and grow
              your career.
            </p>
          </div>

          <div className={styles.featureCards}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <i className="fas fa-code"></i>
              </div>
              <h3 className={styles.featureTitle}>Developer-Focused</h3>
              <p className={styles.featureDescription}>
                Content tailored for developers with syntax highlighting and code snippets.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <i className="fas fa-users"></i>
              </div>
              <h3 className={styles.featureTitle}>Community</h3>
              <p className={styles.featureDescription}>
                Connect with like-minded developers and build your professional network.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <i className="fas fa-rocket"></i>
              </div>
              <h3 className={styles.featureTitle}>Career Growth</h3>
              <p className={styles.featureDescription}>Showcase your expertise and open doors to new opportunities.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className="container">
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>Ready to Start Blogging?</h2>
            <p className={styles.ctaSubtitle}>
              Join thousands of developers who are already sharing their knowledge and experiences.
            </p>
            <div className={styles.ctaButtons}>
              <Link to="/signup">
                <Button variant="primary">Sign Up Now</Button>
              </Link>
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage


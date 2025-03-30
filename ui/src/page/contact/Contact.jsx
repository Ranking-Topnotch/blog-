import { useState } from "react"
import Button from "../../component/button/Button"
import Input from "../../component/input/Input"
import TextArea from "../../component/textArea/TextArea"
import styles from "./contact.module.css"

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
   
    console.log("Contact form submitted:", formData)
    alert("Message sent successfully!")
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    })
  }

  return (
    <div className={styles.contactPage}>
      <div className="container">
        <div className={styles.contactGrid}>
          <div className={styles.contactInfo}>
            <h1 className={styles.title}>Contact Us</h1>
            <p className={styles.subtitle}>Have questions or feedback? We'd love to hear from you.</p>

            <div className={styles.infoCard}>
              <h2 className={styles.infoTitle}>Developer Contact Information</h2>

              <div className={styles.infoItem}>
                <i className="fas fa-envelope"></i>
                <div>
                  <h3>Email</h3>
                  <p>contact@devblog.com</p>
                </div>
              </div>

              <div className={styles.infoItem}>
                <i className="fas fa-phone"></i>
                <div>
                  <h3>Phone</h3>
                  <p>+1 (555) 123-4567</p>
                </div>
              </div>

              <div className={styles.infoItem}>
                <i className="fas fa-map-marker-alt"></i>
                <div>
                  <h3>Address</h3>
                  <p>123 Developer Way, San Francisco, CA 94107</p>
                </div>
              </div>

              <div className={styles.infoItem}>
                <i className="fab fa-github"></i>
                <div>
                  <h3>GitHub</h3>
                  <a href="https://github.com/devblog" target="_blank" rel="noopener noreferrer">
                    github.com/devblog
                  </a>
                </div>
              </div>

              <div className={styles.infoItem}>
                <i className="fab fa-linkedin"></i>
                <div>
                  <h3>LinkedIn</h3>
                  <a href="https://linkedin.com/company/devblog" target="_blank" rel="noopener noreferrer">
                    linkedin.com/company/devblog
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.contactForm}>
            <div className={styles.formCard}>
              <h2 className={styles.formTitle}>Send us a message</h2>
              <p className={styles.formSubtitle}>
                Fill out the form below and we'll get back to you as soon as possible.
              </p>

              <form onSubmit={handleSubmit}>
                <div className={styles.formGrid}>
                  <Input
                    label="Name"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                  />

                  <Input
                    label="Email"
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your email"
                    required
                  />
                </div>

                <Input
                  label="Subject"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Message subject"
                  required
                />

                <TextArea
                  label="Message"
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your message"
                  rows={6}
                  required
                />

                <Button type="submit" fullWidth>
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact


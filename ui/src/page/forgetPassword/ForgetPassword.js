import { useState } from "react"
import { Link } from "react-router-dom"
import Button from "../../component/button/Button"
import Input from "../../component/input/Input"
import styles from "./forgetPassword.module.css"
import toast from "react-hot-toast"

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    email: ""
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

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

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (validateForm()) {
        const fetchData = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/forgetpassword`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: formData.email
            })
        });
      
          const resData = await fetchData.json()
        if(resData.message === "Password reset link sent to email."){
          setIsSubmitting(true)
          setIsSubmitting(false)
          setSuccessMessage("Password reset instructions have been sent to your email.")
        }else{
          toast(resData.message)  
        }
    }
  }

  return (
    <div className={styles.forgotPasswordPage}>
      <div className={styles.formContainer}>
        <div className={styles.formCard}>
          <h1 className={styles.formTitle}>Reset Password</h1>
          <p className={styles.formSubtitle}>Enter your email and user ID to receive password reset instructions</p>

          {successMessage ? (
            <div className={styles.successMessage}>
              <i className="fas fa-check-circle"></i>
              <p>{successMessage}</p>
              <p className={styles.redirectMessage}>Redirect to your mail...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form}>
              <Input
                label="Email"
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                error={errors.email}
                required
              />

              <Button type="submit" fullWidth disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Reset Password"}
              </Button>

              <div className={styles.formLinks}>
                <Link to="/login" className={styles.backToLogin}>
                  Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword


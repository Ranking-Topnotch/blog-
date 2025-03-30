import { useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import Button from "../../component/button/Button"
import Input from "../../component/input/Input"
import styles from "./forgetPassword.module.css"
import toast from "react-hot-toast"

const ResetPassword = () => {
    const { token } = useParams(); // Get token from URL
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
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

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log(formData.email)
    if (validateForm()) {
        const fetchData = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/resetpassword`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                token,
                newPassword: formData.password
            })
        });
      
        const resData = await fetchData.json()
        if(resData.message === "Password reset successful."){
            setIsSubmitting(true)
            navigate('/login');
            setIsSubmitting(false)
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
              <p className={styles.redirectMessage}>Redirecting to login page...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form}>
               <Input
                    label="Password"
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    error={errors.password}
                    required
                    />
        
                    <Input
                    label="Confirm Password"
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    error={errors.confirmPassword}
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

export default ResetPassword


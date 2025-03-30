import { useContext, useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import Button from "../../component/button/Button"
import Input from "../../component/input/Input"
import styles from "./loginForm.module.css"
import toast from "react-hot-toast";
import { UserContext } from "../../context/UserContext"

const LoginForm = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const { login } = useContext(UserContext);
  const [errors, setErrors] = useState({})
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

    if (!formData.password) {
      newErrors.password = "Password is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (validateForm()) {
      e.preventDefault()

      const fetchData = await login(formData.email, formData.password);
      
      
      toast(fetchData.message)

      if(fetchData.message === 'User not verify'){
        navigate('/otpverification', { state: fetchData.data })
      }else if(fetchData.message === 'Login successfull'){
        if(location.pathname === '/login'){
          navigate('/')
        }else{
          navigate(location.pathname)
        }  
      }
    }
  }

  const handleGoogleLogin = () => {
    window.open(`${process.env.REACT_APP_SERVER_DOMAIN}/auth/google`, "_self")
  }

  return (
    <div className={styles.loginPage}>
      <div className={styles.formContainer}>
        <div className={styles.formCard}>
          <h1 className={styles.formTitle}>Login</h1>
          <p className={styles.formSubtitle}>Enter your credentials to access your account</p>

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

            <div className={styles.passwordField}>
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
              <Link to="/forgetpassword" className={styles.forgotPassword}>
                Forgot password?
              </Link>
            </div>

            <Button type="submit" fullWidth>
              Login
            </Button>
          </form>

          <div className={styles.divider}>
            <span>Or continue with</span>
          </div>

          <Button variant="outline" fullWidth onClick={handleGoogleLogin} className={styles.googleButton}>
            <i className="fab fa-google"></i>
            Login with Google
          </Button>

          <p className={styles.signupLink}>
            Don't have an account? <Link to="/register">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginForm


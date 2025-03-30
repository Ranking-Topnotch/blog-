import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Button from "../../component/button/Button"
import Input from "../../component/input/Input"
import styles from "./registerForm.module.css"
import { ImageUtility } from '../../utility/ImageUtility';
import toast from 'react-hot-toast'
import Avatar from '../../assest/noavatar.png';

const RegisterForm = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    img: "",
  })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleImageUpoad = async(e) => {
    const data = await ImageUtility(e.target.files[0])

    setFormData((prev) => {
      return{
        ...prev,
        img: data
      }
    })
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.username) {
      newErrors.username = "Username is required"
    }

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

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

    if (validateForm()) {
            
      const fetchData = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/register`, {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify(formData)
      })

        const fetchRes = await fetchData.json()
        toast(fetchRes.message)
      
      if(fetchRes.message === 'Verification otp email send'){
        navigate('/otpverification', { state: fetchRes.data });
      }
      
      if(fetchRes.message === 'Signup successful'){
        navigate('/login')
      }
          
    }
  }

  const handleGoogleSignup = () => {
    window.open(`${process.env.REACT_APP_SERVER_DOMAIN}/auth/google`, "_self")
  }

  return (
    <div className={styles.signupPage}>
      <div className={styles.formContainer}>
        <div className={styles.formCard}>
          <h1 className={styles.formTitle}>Create an account</h1>
          <p className={styles.formSubtitle}>Join our community of developers</p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <Input
              label="Username"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="johndoe"
              error={errors.username}
              required
            />

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

            <Input
              label="Profile Image URL (optional)"
              id="img"
              name="img"
              value={formData.img}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
            <label htmlFor='avatar'>
              <div>
              { formData.img ? <img className={styles.avatar} src={formData.img} alt='blog' height={20} width={20} /> : <img className={styles.avatar} src={Avatar} alt='blog' height={20} width={20} />}
              <input id='avatar' type={'file'} placeholder="image" accept="image/*" onChange={handleImageUpoad} name="img" hidden/>
            </div>
            </label>

            <Button type="submit" fullWidth>
              Sign Up
            </Button>
          </form>

          <div className={styles.divider}>
            <span>Or continue with</span>
          </div>

          <Button variant="outline" fullWidth onClick={handleGoogleSignup} className={styles.googleButton}>
            <i className="fab fa-google"></i>
            Sign up with Google
          </Button>

          <p className={styles.loginLink}>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterForm


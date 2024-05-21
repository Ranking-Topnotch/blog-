import { Link, useNavigate, useLocation } from "react-router-dom";
import styles from "./loginForm.module.css";
import { useState } from "react";
import toast from "react-hot-toast";


const LoginForm = ({ passedMember }) => {
  const location = useLocation()
  const [ loginData, setLoginData ] = useState({
    email: '',
    password: ''
  })

  const navigate = useNavigate()

  const handleLoginChange = (e) => {
    const { name, value } = e.target

    setLoginData((prev) => {
      return{
        ...prev,
        [ name ] : value
      }
    })
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault()

    const fetchData = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(loginData)
    })

    const fetchRes = await fetchData.json()

    toast(fetchRes.message)

    if(fetchRes.message === 'User not verify'){
      navigate('/otpverification', { state: fetchRes.data })
    }else if(fetchRes.message === 'Login successfull'){
      if(location.pathname === '/login'){
        navigate('/')
      }else{
        navigate(location.pathname)
      }  
    }

    if (fetchRes.member) {
      passedMember(fetchRes.member); // Pass any desired element or data
    }
  }

 const google = () => {
  window.open("http://localhost:8000/auth/google", "_self")
 }

  return (
    <div className={styles.loginform}>
      <div className={styles.formcon}>
        <div onClick={google} className={styles.github}>Login with Google</div>
        <form className={styles.form} onSubmit={handleLoginSubmit}>
          <input type="text" placeholder="email" name="email" value={loginData.email} onChange={handleLoginChange}/>
          <input type="password" placeholder="password" name="password" value={loginData.password} onChange={handleLoginChange} />
          <button>Login</button>
        </form>
      </div>

      <Link to="/register" className={styles.link}>
        {"Don't have an account?"} <p>Register</p>
      </Link>
    </div>
  );
};

export default LoginForm;
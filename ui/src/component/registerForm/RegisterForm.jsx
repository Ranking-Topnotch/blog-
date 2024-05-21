import React, { useState } from 'react'
import styles from "./registerForm.module.css";
import { Link, useNavigate } from 'react-router-dom';
import { ImageUtility } from '../../utility/ImageUtility';
import Avatar from '../../assest/noavatar.png';
import toast from 'react-hot-toast';

const RegisterForm = () => {

  const navigate = useNavigate()
  
  const [registerInform, setRegisterForm] = useState({
    img: '',
    username: '',
    email: '',
    password: '',
    passwordRepeat: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target

    setRegisterForm((prev) => {
      return {
        ...prev,
        [ name ] : value
      }
    })
  }

  const handleImageUpoad = async(e) => {
    const data = await ImageUtility(e.target.files[0])

    setRegisterForm((prev) => {
      return{
        ...prev,
        img: data
      }
    })
  }

  const  handleSubmit = async (e) => {
    e.preventDefault()
    
    const { username, email, password, passwordRepeat } = registerInform
    
    if(username && email && password && passwordRepeat){
      
      const fetchData = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/register`, {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify(registerInform)
      })

       const fetchRes = await fetchData.json()
       toast(fetchRes.message)
      
      if(fetchRes.message === 'Verification otp email send'){
        navigate('/otpverification', { state: fetchRes.data });
      }
      
       if(fetchRes.message === 'Signup successful'){
        navigate('/login')
       }
    }else{
      toast('Error in Login')
    }   
  }

  return (
    <div className={styles.registerForm}>
      <form className={styles.form}  onSubmit={handleSubmit}>
       <label htmlFor='avatar'>
        <div>
            { registerInform.img ? <img className={styles.avatar} src={registerInform.img} alt='blog' height={20} width={20} /> : <img className={styles.avatar} src={Avatar} alt='blog' height={20} width={20} />}
            <input id='avatar' type={'file'} placeholder="image" accept="image/*" onChange={handleImageUpoad} name="img" hidden/>
          </div>
       </label>
        <input type="text" placeholder="username" name="username" value={registerInform.username} onChange={handleChange}/>
        <input type="email" placeholder="email" name="email" value={registerInform.email} onChange={handleChange} />
        <input type="password" placeholder="password" name="password" value={registerInform.password} onChange={handleChange} />
        <input
          type="password"
          placeholder="password again" 
          name="passwordRepeat"
          value={registerInform.passwordRepeat}
          onChange={handleChange}
        />
        <button type="submit">Register</button>
      </form>
      
        <Link to="/login" className={styles.link}>
          Have an account? <p>Login</p>
        </Link>
    </div>
  );
};

export default RegisterForm;
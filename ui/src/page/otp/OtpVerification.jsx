import React, { useEffect, useState } from 'react'
import style from './otpVerification.module.css'
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';


const OtpVerification = () => {
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        if (!location.state) {
            navigate('/login');
        }
    }, [location.state, navigate]);

    const { userId, email } = location.state || {};
    const [ otpForm, setOptForm ] = useState({
       otp: '',
       userId: userId || '' ,
       email: email || ''
    })
    
    useEffect( () => {
        if(userId){
            setOptForm(( prev ) => ({
                ...prev,
                userId: userId,
                email: email
            }))
        }
    }, [ userId ])

    const handleChange = ( e ) => {
        const { name, value } = e.target

        setOptForm( prev => ({ ...prev, [ name ]: value }))
    }

    const handleSubmit = async ( e ) => {
        e.preventDefault()
        const fetchData = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/verifyOtp`, {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(otpForm)
        })

        const resData = await fetchData.json()
        toast(resData.message)
        if(resData.message === 'User verify'){
           navigate('/login') 
        }
    }

    const handleResendOtp = async ( e ) => {
        e.preventDefault()
        const fetchData = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/resendOtp`, {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(otpForm)
        })

        const resData = await fetchData.json()

        if(resData.message === 'An error occurred'){
            navigate('/login')
        }
       
    }

  return (
    <div className={style.otpCon}>
        <p className={style.input_otp}> Input Otp</p>
        <form onSubmit={handleSubmit} className={style.form}>
            <input type={'text'} name='userId' value={otpForm.userId} hidden readOnly />
            <input type={'text'} name='email' value={otpForm.email} hidden readOnly />
            <input type={'text'} name='otp' value={otpForm.otp} onChange={handleChange}/>
            <div className={style.buttoncon}>
                <button className={style.resend}>Submit</button>
                <p onClick={handleResendOtp} className={style.resend}>Re-send Otp</p>
            </div>
        </form>
    </div>
  )
}

export default OtpVerification
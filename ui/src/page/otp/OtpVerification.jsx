import { useState, useEffect, useRef } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import Button from "../../component/button/Button"
import styles from "./otpVerification.module.css"
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
  const [otp, setOtp] = useState(["", "", "", ""])
  const [timer, setTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const inputRefs = useRef([])

  useEffect(() => {
    // Focus the first input when component mounts
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }

    // Start countdown timer
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(interval)
          setCanResend(true)
          return 0
        }
        return prevTimer - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleChange = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value.substring(0, 1) // Take only the first character
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 3 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus()
    }
  }

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace if current field is empty
    if (e.key === "Backspace" && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text/plain").trim()

    // Check if pasted content is a 4-digit number
    if (/^\d{4}$/.test(pastedData)) {
      const digits = pastedData.split("")
      setOtp(digits)

      // Focus the last input
      if (inputRefs.current[3]) {
        inputRefs.current[3].focus()
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const otpValue = otp.join("")
    if (otpValue.length === 4) {

      const fetchData = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/verifyOtp`, {
          method: "POST",
          headers: {
              "content-type": "application/json"
          },
          body: JSON.stringify({userId, otp: otpValue})
      })

      const resData = await fetchData.json()
      toast(resData.message)
      if(resData.message === 'User verify'){
          navigate('/login') 
      }
    } else {
      alert("Please enter a complete OTP")
    }
  }

  const handleResend = async () => {
    const fetchData = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/resendOtp`, {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify()
    })

    const resData = await fetchData.json()

    if(resData.message === 'An error occurred'){
        navigate('/login')
    }

    // Reset timer and OTP fields
    setOtp(["", "", "", ""])
    setTimer(60)
    setCanResend(false)

    // Focus the first input
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }

  return (
    <div className={styles.otpPage}>
      <div className={styles.formContainer}>
        <div className={styles.formCard}>
          <h1 className={styles.formTitle}>Verification</h1>
          <p className={styles.formSubtitle}>We've sent a verification code to your email</p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.otpInputs}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className={styles.otpInput}
                  aria-label={`Digit ${index + 1}`}
                />
              ))}
            </div>

            <Button type="submit" fullWidth disabled={otp.join("").length !== 4}>
              Verify
            </Button>
          </form>

          <div className={styles.resendContainer}>
            {canResend ? (
              <button className={styles.resendButton} onClick={handleResend}>
                Resend verification code
              </button>
            ) : (
              <p className={styles.timerText}>
                Resend code in <span>{timer}s</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default OtpVerification


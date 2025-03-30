import styles from "./button.module.css"

const Button = ({
  children,
  type = "button",
  variant = "primary",
  fullWidth = false,
  disabled = false,
  onClick,
  className = "",
}) => {
  return (
    <button
      type={type}
      className={`
        ${styles.button} 
        ${styles[variant]} 
        ${fullWidth ? styles.fullWidth : ""} 
        ${disabled ? styles.disabled : ""}
        ${className}
      `}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default Button


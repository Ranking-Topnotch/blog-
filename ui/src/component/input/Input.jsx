import styles from "./input.module.css"

const Input = ({
  label,
  type = "text",
  id,
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  className = "",
  hidden=false
}) => {
  return (
    <div className={`${styles.formGroup} ${className}`}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label} {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`${styles.input} ${error ? styles.inputError : ""}`}
        required={required}
        hidden={hidden}
      />
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  )
}

export default Input


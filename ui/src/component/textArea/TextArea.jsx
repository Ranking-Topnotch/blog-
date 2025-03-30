import styles from "./textArea.module.css"

const TextArea = ({
  label,
  id,
  name,
  value,
  onChange,
  placeholder,
  rows = 5,
  error,
  required = false,
  className = "",
}) => {
  return (
    <div className={`${styles.formGroup} ${className}`}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label} {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className={`${styles.textarea} ${error ? styles.textareaError : ""}`}
        required={required}
      />
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  )
}

export default TextArea


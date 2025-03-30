import LoginForm from "../../component/loginForm/LoginForm";
import styles from "./login.module.css";

const Login = () => {

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
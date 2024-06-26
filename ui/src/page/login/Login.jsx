import LoginForm from "../../component/loginForm/LoginForm";
import styles from "./login.module.css";

const Login = ({ passedMember }) => {

  const google = () => {
    window.open(`${process.env.REACT_APP_SERVER_DOMAIN}/auth/google`, "_self")
   }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* <div onClick={google} className={styles.github}>Login with Google</div> */}
        <LoginForm passedMember={passedMember}/>
      </div>
    </div>
  );
};

export default Login;
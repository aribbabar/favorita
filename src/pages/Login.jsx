// react
import { useContext, useEffect, useState } from "react";

// react router
import { useNavigate } from "react-router-dom";

// firebase
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";

// contexts
import { UserContext } from "../contexts/UserContext";

// styles
import styles from "../styles/Login.module.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { user, dispatch } = useContext(UserContext);

  const navigate = useNavigate();

  useEffect(() => {
    setError("");
  }, [window.location.pathname]);

  function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);

    // client-side validation
    if (!email) {
      setError("Please fill in an email");
      setLoading(false);
      return;
    }

    if (!password) {
      setError("Please fill in a password");
      setLoading(false);
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const uid = userCredential.user.uid;

        navigate("/");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        setError("Email or password is incorrect");
        setLoading(false);

        console.log(errorCode, errorMessage);
      });
  }

  return (
    <div className={styles.container}>
      <form className={styles.form}>
        <input
          type="text"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => {
            setPassword(e.target.value);
            setError("");
          }}
        />
        <input
          type="submit"
          value="Sign in"
          disabled={loading}
          onClick={handleSubmit}
        />
      </form>
      <div className="loadingBallContainer">
        {loading && <div className="loadingBall secondary-color"></div>}
      </div>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}

export default Login;

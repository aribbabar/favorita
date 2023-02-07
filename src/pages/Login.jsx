import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "../styles/Login.module.css";

function LoginAndRegister({ type }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

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
        const user = userCredential.user;

        navigate("/");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        setError("Email or password is incorrect");

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
          type="text"
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
          value={type}
          disabled={loading}
          onClick={handleSubmit}
        />
      </form>
      <div className="loadingBallContainer">
        {loading && <div className="loadingBall"></div>}
      </div>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}

export default LoginAndRegister;

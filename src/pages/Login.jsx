import { auth, db } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "../styles/login.module.css";

function LoginAndRegister({ type }) {
  const [email, setEmail] = useState("johndoe@gmail.com");
  const [password, setPassword] = useState("helloworld");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    setError("");
  }, [window.location.pathname]);

  function handleSubmit(e) {
    e.preventDefault();

    // client-side validation
    if (!email) {
      setError("Please fill in an email");
      return;
    }

    if (!password) {
      setError("Please fill in a password");
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;

        console.log(user);

        navigate("/");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

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
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <input type="submit" value={type} onClick={handleSubmit} />
      </form>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}

export default LoginAndRegister;

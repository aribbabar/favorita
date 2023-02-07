import { auth, db } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "../styles/login.module.css";
import { doc, setDoc } from "firebase/firestore";

function LoginAndRegister() {
  const [firstName, setFirstName] = useState("John");
  const [lastName, setLastName] = useState("Doe");
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
    if (!firstName) {
      setError("Please enter your first name");
      return;
    }

    if (!lastName) {
      setError("Please enter your last name");
      return;
    }

    if (!email) {
      setError("Please fill in an email");
      return;
    }

    if (!password) {
      setError("Please fill in a password");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;

        console.log(user);

        async function addUserToDb() {
          const docRef = await setDoc(doc(db, "users", user.uid), {
            firstName,
            lastName
          });

          return docRef;
        }

        addUserToDb().then(() => {
          navigate("/");
        });
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
          placeholder="First Name"
          value={firstName}
          required
          onChange={(e) => {
            setFirstName(e.target.value);
            setError("");
          }}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          required
          onChange={(e) => {
            setLastName(e.target.value);
            setError("");
          }}
        />
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
        <input type="submit" value="Register" onClick={handleSubmit} />
      </form>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}

export default LoginAndRegister;

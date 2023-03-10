// react
import { useContext, useEffect, useState } from "react";

// react router
import { useNavigate } from "react-router-dom";

//firebase
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

// contexts
import { UserContext } from "../contexts/UserContext";

// styles
import styles from "../styles/pages/Register.module.css";

// assets
import Spinner from "../assets/Spinner.jsx";

function LoginAndRegister() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { user, dispatch } = useContext(UserContext);

  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setLoading(true);

    // client-side validation
    if (!firstName) {
      setError("Please enter your first name");
      setLoading(false);
      return;
    }

    if (!lastName) {
      setError("Please enter your last name");
      setLoading(false);
      return;
    }

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

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;

        // add user to database and create some default categories
        async function addUserToDb() {
          const docRef = await setDoc(doc(db, "users", user.uid), {
            firstName,
            lastName,
            categories: ["Game", "Movie", "TV-Show"]
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

        if (errorCode === "auth/admin-restricted-operation") {
          setError(
            "Sorry, but you can not register. Please contact admin for a new account"
          );
        } else {
          setError("Oops... Something went wrong! Please try again later.");
        }

        setLoading(false);

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
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          required
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            setError("");
          }}
        />
        <input
          type="submit"
          value="Register"
          disabled={loading}
          onClick={handleSubmit}
        />
      </form>
      {loading && <Spinner />}
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}

export default LoginAndRegister;

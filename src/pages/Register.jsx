// react
import { useEffect, useState } from "react";

// react router
import { useNavigate } from "react-router-dom";

//firebase
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

// styles
import styles from "../styles/Register.module.css";

function LoginAndRegister() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
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

        if (errorCode === "auth/admin-restricted-operation") {
          setError(
            "Sorry, but you can not register. Please contact admin for a new account"
          );
        } else {
          setError("Oops... Something went wrong! Please try again later.");
        }

        console.log(errorCode, errorMessage);
      });
  }

  return (
    <div className={styles.container}>
      <h2>
        Due to the developer (me) being on the spark plan of firebase, and just
        generally being poor, new sign-ups are not allowed. Please contact me
        for a new account if you want to mess around with this app.
      </h2>
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
        <input
          type="submit"
          value="Register"
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

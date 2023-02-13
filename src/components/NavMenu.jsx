// react
import { useContext } from "react";

// react router
import { Link } from "react-router-dom";

// firebase
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";

// contexts
import { UserContext } from "../contexts/UserContext";

// styles
import styles from "../styles/NavMenu.module.css";

function NavMenu({ flipModal }) {
  const { user, dispatch } = useContext(UserContext);

  function signUserOut() {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        console.log("signed out successfully");

        flipModal();
      })
      .catch((error) => {
        // An error happened.
        console.log(error);
      });
  }

  return (
    <nav className={styles.nav}>
      <div className={styles.underlay} onClick={flipModal}></div>
      <ul className={styles.linksContainer}>
        <span className={`${styles.close} material-icons`} onClick={flipModal}>
          close
        </span>
        {!user.uid && (
          <li>
            <Link to={"login"} className={styles.link} onClick={flipModal}>
              Login
            </Link>
          </li>
        )}
        {!user.uid && (
          <li>
            <Link to={"register"} className={styles.link} onClick={flipModal}>
              Register
            </Link>
          </li>
        )}
        {user.uid && (
          <li>
            <Link
              to={"create"}
              className={styles.link}
              onClick={() => {
                flipModal();
              }}
            >
              Create New Favorite
            </Link>
          </li>
        )}
        {user.uid && (
          <li>
            <Link className={styles.link} to={"/"} onClick={signUserOut}>
              Sign out
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default NavMenu;

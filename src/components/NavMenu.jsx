import { Link } from "react-router-dom";

import { signOut } from "firebase/auth";

import styles from "../styles/NavMenu.module.css";

function NavMenu({ auth, flipModal, loggedIn, setLoggedIn }) {
  function signUserOut() {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        console.log("signed out successfully");

        flipModal();
        setLoggedIn(false);
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
        <li>
          {!loggedIn && (
            <Link to={"login"} className={styles.link} onClick={flipModal}>
              Login
            </Link>
          )}
        </li>
        <li>
          {!loggedIn && (
            <Link to={"register"} className={styles.link} onClick={flipModal}>
              Register
            </Link>
          )}
        </li>
        <li>
          {loggedIn && (
            <Link
              to={"create"}
              className={styles.link}
              onClick={() => {
                flipModal();
              }}
            >
              Create New Favorite
            </Link>
          )}
        </li>
        <li>
          {loggedIn && (
            <Link
              to={"/"}
              className={styles.link}
              onClick={() => {
                signUserOut();
              }}
            >
              Sign out
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
}

export default NavMenu;

// react
import { useState, useEffect, useContext } from "react";

// react-router
import { Link } from "react-router-dom";

// firebase
import { db, auth } from "../firebaseConfig";
import { collection, getDocs, query, startAt } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

// contexts
import { UserContext } from "../contexts/UserContext";

// components
import Favorite from "../components/Favorite";

// styles
import styles from "../styles/Home.module.css";
import CustomSelect from "../components/CustomSelect";

function Home() {
  const { user, dispatch } = useContext(UserContext);

  function fetchMoreDocs() {
    // const q = query(collection(db, "users", user.uid, "favorites"), startAt(user.currIndex));
  }

  return (
    <>
      {user.uid && <CustomSelect />}
      <div className={styles.favoritesContainer}>
        {user?.favorites.map((favorite) => (
          <Favorite key={favorite.id} favorite={favorite} />
        ))}
      </div>
      {user.uid && (
        <button className={`btn ${styles.loadMoreBtn}`} onClick={fetchMoreDocs}>
          Load More
        </button>
      )}
      {/* if the user is logged in and did not add any favorites yet */}
      {user.uid && user?.favorites.length === 0 && (
        <div className={styles.feelsEmptyContainer}>
          <p>Feels empty in here...</p>
          <Link className={styles.createBtn} to="/create">
            <span className="material-icons">add_circle</span>
          </Link>
        </div>
      )}
      {/* if the user is not yet logged in */}
      {!user.uid && (
        <Link className={`btn ${styles.loginBtn}`} to="/login">
          Login
        </Link>
      )}
    </>
  );
}

export default Home;

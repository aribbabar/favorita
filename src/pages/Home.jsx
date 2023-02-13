// react
import { useContext } from "react";

// react-router
import { Link } from "react-router-dom";

// firebase
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter
} from "firebase/firestore";
import { db } from "../firebaseConfig";

// contexts
import { UserContext } from "../contexts/UserContext";

// components
import Favorite from "../components/Favorite";

// styles
import CustomSelect from "../components/CustomSelect";
import styles from "../styles/Home.module.css";

function Home() {
  const { user, dispatch } = useContext(UserContext);

  function fetchMoreDocs() {
    if (user.lastVisibleDoc === undefined) {
      return;
    }

    async function getFavorites() {
      const docsRef = collection(db, "users", user.uid, "favorites");

      const q = query(
        docsRef,
        orderBy("title"),
        startAfter(user.lastVisibleDoc),
        limit(5)
      );

      const querySnapshot = await getDocs(q);

      const lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

      dispatch({
        type: "UPDATE_LAST_VISIBLE_DOCUMENT",
        lastVisibleDoc: lastVisibleDoc
      });

      querySnapshot.forEach((doc) => {
        const data = doc.data();

        dispatch({
          type: "ADD_FAVORITE",
          uid: user.uid,
          favoriteId: doc.id,
          favorite: data
        });
      });
    }

    getFavorites();
  }

  return (
    <>
      {user.uid && <CustomSelect />}
      <div className={styles.favoritesContainer}>
        {user?.favorites.map((favorite) => (
          <Favorite key={favorite.id} favorite={favorite} />
        ))}
      </div>
      {user.uid && user.favorites.length !== 0 && user.lastVisibleDoc && (
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

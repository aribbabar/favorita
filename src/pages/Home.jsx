// react
import { useContext } from "react";

// react-router
import { Link } from "react-router-dom";

// contexts
import { UserContext } from "../routes/root";

// components
import Favorite from "../components/Favorite";

// styles
import styles from "../styles/Home.module.css";
import CustomSelect from "../components/CustomSelect";

function Home() {
  const { user, dispatch } = useContext(UserContext);

  return (
    <>
      {user.uid && <CustomSelect />}
      <div className={styles.favoritesContainer}>
        {user?.favorites.map((favorite) => (
          <Favorite key={favorite.id} favorite={favorite} />
        ))}
      </div>
      {/* if the user is logged in and did not add any favorites yet */}
      {user.uid && user?.favorites.length === 0 && (
        <div className={styles.feelsEmptyContainer}>
          <p>Feels empty in here...</p>
          <Link className={styles.createBtn} to="/create">
            <span class="material-icons">add_circle</span>
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

// react
import { useContext } from "react";

// contexts
import { UserContext } from "../routes/root";

// components
import Favorite from "../components/Favorite";

// styles
import styles from "../styles/Home.module.css";

function Home() {
  const { user, dispatch } = useContext(UserContext);

  return (
    <div>
      <div className={styles.favoritesContainer}>
        {user?.favorites.map((favorite) => (
          <Favorite key={favorite.id} favorite={favorite} />
        ))}
      </div>
    </div>
  );
}

export default Home;

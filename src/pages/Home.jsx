// react
import { useState, useContext, useEffect } from "react";

// contexts
import { UserContext } from "../routes/root";

// components
import Favorite from "../components/Favorite";

// styles
import styles from "../styles/Home.module.css";
import CustomSelect from "../components/CustomSelect";

function Home() {
  const { user, dispatch } = useContext(UserContext);
  const [prevOrderBy, setPrevOrderBy] = useState("ASC");

  function flipPrevOrderBy() {
    setPrevOrderBy((prev) => (prev === "ASC" ? "DESC" : "ASC"));
  }

  function optionChange(option) {
    switch (option) {
      case "Alphabetical":
        dispatch({
          type: "SORT_BY_GIVEN_PROPERTY",
          property: "title",
          orderBy: prevOrderBy
        });
        flipPrevOrderBy();

        break;
      case "Rating":
        dispatch({
          type: "SORT_BY_GIVEN_PROPERTY",
          property: "rating",
          orderBy: prevOrderBy
        });
        flipPrevOrderBy();

        break;
      default:
        console.log("invalid option:", option);
    }

    console.log(prevOrderBy);
  }

  return (
    <>
      <CustomSelect
        options={["-- Sort --", "Alphabetical", "Rating"]}
        onChange={optionChange}
      />
      <div className={styles.favoritesContainer}>
        {user?.favorites.map((favorite) => (
          <Favorite key={favorite.id} favorite={favorite} />
        ))}
      </div>
    </>
  );
}

export default Home;

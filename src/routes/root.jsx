// react
import { useEffect, useState, createContext, useReducer } from "react";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";

// firebase
import { auth, db } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

// styles
import styles from "../styles/root.module.css";

// components
import NavMenu from "../components/NavMenu";
import { collection, getDocs } from "firebase/firestore";

export const UserContext = createContext({
  uid: "",
  favorites: []
});

function userReducer(state, action) {
  switch (action.type) {
    case "SET_UID":
      return {
        uid: action.uid,
        favorites: state.favorites
      };
    case "ADD_FAVORITE":
      return {
        uid: state.uid,
        favorites: [
          ...state.favorites,
          {
            id: action.favoriteId,
            title: action.favorite.title,
            rating: action.favorite.rating,
            type: action.favorite.type,
            image: action.favorite.image
          }
        ]
      };
    case "UPDATE_FAVORITE":
      return {
        uid: state.uid,
        favorites: [
          ...state.favorites.filter((fav) => fav.id !== action.favorite.id),
          {
            id: action.favorite.id,
            title: action.favorite.title,
            rating: action.favorite.rating,
            type: action.favorite.type,
            image: action.favorite.image
          }
        ]
      };
    case "REMOVE_FAVORITE":
      return {
        uid: state.uid,
        favorites: state.favorites.filter((fav) => fav.id !== action.id)
      };
    case "SIGN_OUT":
      return {
        uid: "",
        favorites: []
      };
    default:
      return state;
  }
}

function Root() {
  const [modal, setModal] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  const [user, dispatch] = useReducer(userReducer, {
    uid: "",
    favorites: []
  });

  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (u) => {
      if (u) {
        // User is signed in
        const uid = u.uid;

        setLoggedIn(true);

        dispatch({ type: "SET_UID", uid });

        async function getFavorites() {
          console.log("new request for all docs");

          const docsRef = collection(db, "users", uid, "favorites");
          const docsSnap = await getDocs(docsRef);

          docsSnap.forEach((doc) => {
            const data = doc.data();

            dispatch({
              type: "ADD_FAVORITE",
              uid,
              favoriteId: doc.id,
              favorite: data
            });
          });
        }

        getFavorites();
      } else {
        // User is signed out

        // remove favorites from global state
        dispatch({ type: "SIGN_OUT" });

        console.log("user is signed out");
      }
    });
  }, []);

  function flipModal() {
    setModal(!modal);

    console.log("modal switched");
  }

  return (
    <>
      {modal && (
        <NavMenu
          auth={auth}
          flipModal={flipModal}
          loggedIn={loggedIn}
          setLoggedIn={setLoggedIn}
        />
      )}
      <div className={styles.container}>
        <span
          className={`${styles.hamburger} material-icons`}
          onClick={flipModal}
        >
          menu
        </span>
        <h1 className={styles.heading} onClick={() => navigate("/")}>
          Favorita
        </h1>
        <main>
          <UserContext.Provider value={{ user, dispatch }}>
            <Outlet />
          </UserContext.Provider>
        </main>
      </div>
    </>
  );
}

export default Root;

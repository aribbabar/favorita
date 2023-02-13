// react
import { createContext, useEffect, useReducer } from "react";

// firebase
import { auth, db } from "../firebaseConfig";
import { collection, getDocs, limit, query, startAt } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

// reducers
import userReducer from "../reducers/UserReducer";

export const UserContext = createContext({
  uid: "",
  favorites: []
});

function UserContextProvider({ children }) {
  const [user, dispatch] = useReducer(userReducer, {
    uid: "",
    favorites: []
  });

  useEffect(() => {
    onAuthStateChanged(auth, (u) => {
      if (u) {
        console.log("new request for all docs");

        // User is signed in
        const uid = u.uid;

        dispatch({ type: "SET_UID", uid });

        async function getFavorites() {
          // const q = query(
          //   collection(db, "users", uid, "favorites"),
          //   startAt(0),
          //   limit(1)
          // );
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

          // after adding all docs, sort alphabetically by title
          dispatch({
            type: "SORT_BY_GIVEN_PROPERTY",
            property: "title",
            orderBy: "ASC"
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

  return (
    <UserContext.Provider value={{ user, dispatch }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserContextProvider;

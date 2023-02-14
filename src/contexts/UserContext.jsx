// react
import { createContext, useEffect, useReducer } from "react";

// firebase
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

// reducers
import userReducer from "../reducers/UserReducer";

export const UserContext = createContext();

function UserContextProvider({ children }) {
  const [user, dispatch] = useReducer(userReducer, {
    uid: "",
    favorites: [],
    lastVisibleDoc: undefined
  });

  useEffect(() => {
    onAuthStateChanged(auth, (u) => {
      if (u) {
        console.log("new request for all docs");

        // User is signed in
        const uid = u.uid;

        dispatch({ type: "SET_UID", uid });

        async function getFavorites() {
          const docsRef = collection(db, "users", uid, "favorites");

          const q = query(docsRef, orderBy("title"), limit(5));

          const querySnapshot = await getDocs(q);

          const lastVisibleDoc =
            querySnapshot.docs[querySnapshot.docs.length - 1];

          dispatch({
            type: "UPDATE_LAST_VISIBLE_DOCUMENT",
            lastVisibleDoc: lastVisibleDoc
          });

          querySnapshot.forEach((doc) => {
            const data = doc.data();

            dispatch({
              type: "ADD_FAVORITE",
              uid: uid,
              favoriteId: doc.id,
              favorite: data
            });
          });

          // after adding all docs, sort alphabetically by title
          // dispatch({
          //   type: "SORT_BY_GIVEN_PROPERTY",
          //   property: "title",
          //   orderBy: "ASC"
          // });
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

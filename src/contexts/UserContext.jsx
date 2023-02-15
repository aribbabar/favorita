// react
import { createContext, useEffect, useReducer } from "react";

// firebase
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query
} from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

// reducers
import userReducer from "../reducers/UserReducer";

export const UserContext = createContext();

function UserContextProvider({ children }) {
  const [user, dispatch] = useReducer(userReducer, {
    uid: "",
    favorites: [],
    categories: [],
    lastVisibleDoc: undefined
  });

  useEffect(() => {
    onAuthStateChanged(auth, (u) => {
      if (u) {
        // User is signed in
        const uid = u.uid;

        dispatch({ type: "SET_UID", uid });

        // new request for favorites
        console.log("new request for favorites");
        getFavorites();

        // new request for categories
        console.log("new request for categories");
        getCategories();

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
              favoriteId: doc.id,
              favorite: data
            });
          });
        }

        async function getCategories() {
          const docRef = doc(db, "users", uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const { categories } = docSnap.data();

            dispatch({ type: "SET_CATEGORIES", categories: categories });
          } else {
            console.log("No such document!");
          }
        }
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

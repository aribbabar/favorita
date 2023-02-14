// react
import { useContext, useState } from "react";

// firebase
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { db, storage } from "../firebaseConfig";

// contexts
import { UserContext } from "../contexts/UserContext";

// styles
import styles from "../styles/DeleteModal.module.css";

function ConfirmationModal({ favorite, setConfirmationModal }) {
  const [loading, setLoading] = useState(false);

  const { user, dispatch } = useContext(UserContext);

  async function deleteFavorite() {
    try {
      await deleteDoc(doc(db, "users", user.uid, "favorites", favorite.id));
      console.log("document from firestore deleted successfully");

      if (favorite.image.path) {
        await deleteObject(ref(storage, favorite.image.path));
        console.log("image from storage deleted successfully");
      }
    } catch (err) {
      console.log(err);
    }

    dispatch({ type: "REMOVE_FAVORITE", id: favorite.id });

    setLoading(false);
    setConfirmationModal(false);
  }

  return (
    <>
      <div className={styles.underlay}></div>
      <div className={styles.confirmationModalContainer}>
        <p>Are you sure?</p>
        <button
          disabled={loading}
          onClick={() => {
            setLoading(true);
            deleteFavorite();
          }}
        >
          <span className="material-icons">done</span>
        </button>
        <button onClick={() => setConfirmationModal(false)}>
          <span className="material-icons">close</span>
        </button>
      </div>
    </>
  );
}

export default ConfirmationModal;

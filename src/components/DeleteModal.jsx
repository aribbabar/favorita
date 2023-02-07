import { useContext } from "react";

// firebase
import { db, storage } from "../firebaseConfig";
import { deleteDoc, doc } from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";

// contexts
import { UserContext } from "../routes/root";

import styles from "../styles/DeleteModal.module.css";

function ConfirmationModal({ favorite, setConfirmationModal }) {
  const { user, dispatch } = useContext(UserContext);

  async function deleteFavorite() {
    try {
      await deleteDoc(doc(db, "users", user.uid, "favorites", favorite.id));
      console.log("document from firestore deleted successfully");

      await deleteObject(ref(storage, favorite.image.path));
      console.log("image from storage deleted successfully");
    } catch (err) {
      console.log(err);
    }

    setConfirmationModal(false);
    dispatch({ type: "REMOVE_FAVORITE", id: favorite.id });
  }

  return (
    <>
      <div className={styles.underlay}></div>
      <div className={styles.confirmationModalContainer}>
        <p>Are you sure?</p>
        <span
          className={`${styles.icon} material-icons`}
          onClick={deleteFavorite}
        >
          done
        </span>
        <span
          className={`${styles.icon} material-icons`}
          onClick={() => setConfirmationModal(false)}
        >
          close
        </span>
      </div>
    </>
  );
}

export default ConfirmationModal;

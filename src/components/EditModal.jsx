// react
import { useContext, useState } from "react";

// firebase
import { doc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { db, storage } from "../firebaseConfig";

// contexts
import { UserContext } from "../contexts/UserContext";

// hooks
import { useUploadImage } from "../hooks/useUploadImage";

// styles
import styles from "../styles/EditModal.module.css";

function EditModal({ favorite, setEditModal }) {
  const [title, setTitle] = useState(favorite.title);
  const [rating, setRating] = useState(favorite.rating);
  const [type, setType] = useState(favorite.type);
  const [imageTitle, setImageTitle] = useState(favorite.image.title);
  const [imageFile, setImageFile] = useState(undefined);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { user, dispatch } = useContext(UserContext);

  const { uploadImage } = useUploadImage();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    // client-side validation
    if (!title) {
      setError("Please enter a title");
      setLoading(false);
      return;
    }

    if (!rating) {
      setError("Please enter a rating");
      setLoading(false);
      return;
    }

    if (!type || type === "Type") {
      setError("Please select a type");
      setLoading(false);
      return;
    }

    const favoriteRef = doc(db, "users", user.uid, "favorites", favorite.id);

    let imageRef = undefined;

    const image = {
      title: favorite.image.title,
      path: favorite.image.path
    };

    // if the user changed the image at all
    if (imageTitle !== favorite.image.title) {
      if (imageTitle === "") {
        // user removed the image
        // delete image from storage if an image previously existed
        if (favorite.image.title) {
          await deleteObject(ref(storage, favorite.image.path));
        }

        image.title = "";
        image.path = "";
      } else if (imageTitle !== favorite.image.title) {
        // user uploaded a new image
        // delete image from storage if an image previously existed
        if (favorite.image.title) {
          await deleteObject(ref(storage, favorite.image.path));
        }

        imageRef = await uploadImage(title, imageFile);

        image.title = imageTitle;
        image.path = imageRef.metadata.fullPath;
      }
    }

    await updateDoc(favoriteRef, {
      title: title,
      type: type,
      rating: rating,
      image: image
    });

    console.log("favorite updated");

    // update global state
    dispatch({
      type: "UPDATE_FAVORITE",
      favorite: {
        id: favorite.id,
        title: title,
        type: type,
        rating: rating,
        image: image
      }
    });

    setLoading(false);

    // close edit modal
    setEditModal(false);
  }

  return (
    <>
      <div
        className={styles.underlay}
        onClick={() => {
          setEditModal(false);
        }}
      ></div>
      <div className={styles.container}>
        <button className={styles.closeBtn} onClick={() => setEditModal(false)}>
          <span className="material-icons">close</span>
        </button>
        <form>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setError("");
            }}
          />
          <input
            type="number"
            placeholder="Rating"
            value={rating}
            onChange={(e) => {
              setRating(e.target.value);
              setError("");
            }}
          />
          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              setError("");
            }}
          >
            <option value="Type">-- Select a type --</option>
            <option value="Game">Game</option>
            <option value="Movie">Movie</option>
            <option value="TV-Show">TV-Show</option>
            <option value="Music Track">Music Track</option>
          </select>
          <label htmlFor="img-upload" className={styles.customUploadBtn}>
            <span className="material-icons">upload_file</span> Upload
          </label>
          <input
            id="img-upload"
            type="file"
            onChange={(e) => {
              setImageFile(e.target.files[0]);
              setImageTitle(e.target.files[0].name);
            }}
          />
          <div className={styles.imageDetailsContainer}>
            <input type="text" readOnly value={imageTitle} />
            <span className="material-icons" onClick={() => setImageTitle("")}>
              close
            </span>
          </div>
          <button
            className={styles.submitBtn}
            type="submit"
            disabled={loading}
            onClick={handleSubmit}
          >
            <span className="material-icons">done</span>
          </button>
        </form>
        <div className="loadingBallContainer">
          {loading && <div className="loadingBall"></div>}
        </div>
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </>
  );
}

export default EditModal;

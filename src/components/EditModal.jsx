// react
import { useState, useContext } from "react";

// firebase
import { db, storage } from "../firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";

// contexts
import { UserContext } from "../routes/root";

// styles
import styles from "../styles/EditModal.module.css";

function EditModal({ favorite, setEditModal }) {
  const [title, setTitle] = useState(favorite.title);
  const [rating, setRating] = useState(favorite.rating);
  const [type, setType] = useState(favorite.type);
  const [imageFile, setImageFile] = useState("");
  const [error, setError] = useState("");

  const { user, dispatch } = useContext(UserContext);

  async function handleSubmit(e) {
    e.preventDefault();

    // client-side validation
    if (!title) {
      setError("Please enter a title");
      return;
    }

    if (!rating) {
      setError("Please enter a rating");
      return;
    }

    if (!type || type === "Type") {
      setError("Please select a type");
      return;
    }

    const favoriteRef = doc(db, "users", user.uid, "favorites", favorite.id);

    let imageRef = "";

    if (imageFile) {
      const trimmedTitle = title.replace(/ /g, "");

      let imageStorageRef = "";

      imageStorageRef = ref(
        storage,
        `${user.uid}/images/${trimmedTitle}/${imageFile.name}`
      );

      imageRef = await uploadBytes(imageStorageRef, imageFile);
    }

    const image = {
      title: imageFile ? imageFile.name : "",
      path: imageRef ? imageRef.metadata.fullPath : ""
    };

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

    // close edit modal
    setEditModal(false);
  }

  return (
    <>
      <div className={styles.underlay}></div>
      <div className={styles.container}>
        <span
          className={`${styles.closeIcon} material-icons`}
          onClick={() => setEditModal(false)}
        >
          close
        </span>
        <form>
          <input
            type="text"
            placeholder="Title"
            value={title}
            required
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="number"
            placeholder="Rating"
            value={rating}
            required
            onChange={(e) => setRating(e.target.value)}
          />
          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value);
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
            required
            onChange={(e) => {
              setImageFile(e.target.files[0]);
            }}
          />
          <input
            type="text"
            readOnly
            value={imageFile?.name || favorite.image.title}
          />
          <input type="submit" onClick={handleSubmit} />
        </form>
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </>
  );
}

export default EditModal;

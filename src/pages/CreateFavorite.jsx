// react
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

// firebase
import { db, storage } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";

// styles
import styles from "../styles/CreateFavorite.module.css";

// contexts
import { UserContext } from "../routes/root";

function CreateFavorite() {
  const [title, setTitle] = useState("");
  const [rating, setRating] = useState("");
  const [type, setType] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const { user, dispatch } = useContext(UserContext);
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();

    // start the loading animation
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

    addFavorite();

    async function addFavorite() {
      const trimmedTitle = title.replace(/ /g, "");

      let imageStorageRef = "";
      let imageRef = null;

      if (imageFile) {
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

      // only add an image if one was provided by the user
      const docRef = await addDoc(
        collection(db, "users", user.uid, "favorites"),
        {
          title: title,
          type: type,
          rating: rating,
          image: image
        }
      );

      console.log("Document written with ID: ", docRef.id);

      // update global state
      dispatch({
        type: "ADD_FAVORITE",
        favoriteId: docRef.id,
        favorite: {
          title: title,
          type: type,
          rating: rating,
          image: image
        }
      });

      setLoading(false);

      // go back to home page
      navigate("/");
    }
  }

  return (
    <div className={styles.container}>
      <form>
        <input
          type="text"
          placeholder="Title"
          value={title}
          required
          onChange={(e) => {
            setTitle(e.target.value);
            setError("");
          }}
        />
        <input
          type="number"
          placeholder="Rating"
          value={rating}
          required
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
          required
          onChange={(e) => {
            setImageFile(e.target.files[0]);
          }}
        />
        <input type="text" readOnly value={imageFile?.name || ""} />
        <input type="submit" disabled={loading} onClick={handleSubmit} />
      </form>
      <div className={styles.loadingBallContainer}>
        {loading && <div className={styles.loadingBall}></div>}
      </div>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}

export default CreateFavorite;

// react
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

// firebase
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";

// styles
import styles from "../styles/CreateFavorite.module.css";

// contexts
import { UserContext } from "../contexts/UserContext";

// hooks
import { useUploadImage } from "../hooks/useUploadImage";

function CreateFavorite() {
  const [title, setTitle] = useState("");
  const [rating, setRating] = useState("");
  const [type, setType] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { user, dispatch } = useContext(UserContext);

  const { uploadImage } = useUploadImage();

  const navigate = useNavigate();

  // go back to home if not logged in
  if (!user.uid) {
    navigate("/");
  }

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
      const imageRef = await uploadImage(title, imageFile);

      const image = {
        title: imageFile ? imageFile.name : "",
        path: imageRef ? imageRef?.metadata?.fullPath : ""
      };

      // only add an image if one was provided by the user
      const docRef = await addDoc(
        collection(db, "users", user.uid, "favorites"),
        {
          title: title,
          type: type,
          rating: rating,
          image: image,
          createdAt: serverTimestamp()
        }
      );

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
        <input
          type="submit"
          value="Add"
          disabled={loading}
          onClick={handleSubmit}
        />
      </form>
      <div className={styles.loadingBallContainer}>
        {loading && <div className={styles.loadingBall}></div>}
      </div>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}

export default CreateFavorite;

// react
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

// firebase
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";

// contexts
import { UserContext } from "../contexts/UserContext";

// hooks
import { useUploadImage } from "../hooks/useUploadImage";

// assets
import Spinner from "../assets/Spinner.jsx";

// styles
import styles from "../styles/pages/CreateFavorite.module.css";

function CreateFavorite() {
  const [title, setTitle] = useState("");
  const [rating, setRating] = useState("");
  const [category, setCategory] = useState("");
  const [imageFile, setImageFile] = useState(undefined);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { user, dispatch } = useContext(UserContext);

  const { uploadImage } = useUploadImage();

  const navigate = useNavigate();

  async function handleSubmit(e) {
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

    if (!category || category === "Category") {
      setError("Please select a category");
      setLoading(false);
      return;
    }

    if (imageFile && !imageFile?.type.startsWith("image/")) {
      setError("Please select an image");
      setLoading(false);
      return;
    }

    try {
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
          category: category,
          rating: !isNaN(rating) ? parseFloat(rating) : rating,
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
          category: category,
          rating: !isNaN(rating) ? parseFloat(rating) : rating,
          image: image
        }
      });

      // go back to home page
      navigate("/");
    } catch (err) {
      setError("Oops... Something went wrong!");
      setLoading(false);

      console.log(err);
    }
  }

  return (
    <div className={styles.container}>
      <h2>Create New Favorite</h2>
      <div className="line-break"></div>
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
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setError("");
          }}
        >
          <option value="Category">-- Select a category --</option>
          {user.categories.map((category, i) => (
            <option key={i} value={category}>
              {category}
            </option>
          ))}
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
            setError("");
          }}
        />
        <input type="text" readOnly value={imageFile?.name || ""} />
        <input
          type="submit"
          value="Create"
          disabled={loading}
          onClick={handleSubmit}
        />
      </form>
      {loading && <Spinner />}
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}

export default CreateFavorite;

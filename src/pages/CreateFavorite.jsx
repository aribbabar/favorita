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
  const [title, setTitle] = useState("The Last of Us");
  const [rating, setRating] = useState("10");
  const [type, setType] = useState("Game");
  const [imageFile, setImageFile] = useState("");
  const [error, setError] = useState("");

  const { user, dispatch } = useContext(UserContext);
  const navigate = useNavigate();

  function handleSubmit(e) {
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
            console.log(e.target.value);
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
            console.log(e.target.files[0]);
          }}
        />
        <input type="text" readOnly value={imageFile?.name || ""} />
        <input type="submit" onClick={handleSubmit} />
      </form>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}

export default CreateFavorite;

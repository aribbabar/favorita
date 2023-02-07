import { useEffect, useState } from "react";

// firebase
import { storage } from "../firebaseConfig";
import { getDownloadURL, ref } from "firebase/storage";

// styles
import styles from "../styles/Favorite.module.css";

function Favorites({ favorite }) {
  const [imageURL, setImageURL] = useState("");
  const [randomColor, setRandomColor] = useState("");

  useEffect(() => {
    if (!favorite.imageRef) {
      setRandomColor(generateRandomColor());
      return;
    }

    getDownloadURL(ref(storage, favorite.imageRef))
      .then((url) => {
        setImageURL(url);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
  }

  function generateRandomColor() {
    const randomInt = getRandomIntInclusive(0, 360);

    return `hsl(${randomInt}, 50%, 70%)`;
  }

  return (
    <div className={styles.favoriteContainer}>
      {/* display an image if one exists */}
      {imageURL && <img src={imageURL} alt={favorite.title} />}
      {/* dynamically generate one otherwise */}
      {!imageURL && (
        <div
          className={styles.dynoImage}
          style={{ backgroundColor: randomColor }}
        >
          <p>{favorite.title.charAt(0).toUpperCase()}</p>
        </div>
      )}
      <div className={styles.editDeletContainer}>
        <div className={styles.editContainer}>
          <span class="material-icons">edit</span>
          <p>Edit</p>
        </div>
        <div className={styles.deleteContainer}>
          <span class="material-icons">delete</span>
          <p>Delete</p>
        </div>
      </div>
      <h2>{favorite.title}</h2>
      <h3>Type: {favorite.type}</h3>
      <h3>Rating: {favorite.rating}</h3>
    </div>
  );
}

export default Favorites;

// react
import { useEffect, useState } from "react";

// firebase
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../firebaseConfig";

// components
import DeleteModal from "./DeleteModal";
import FavoriteEditModal from "./FavoriteEditModal";

// styles
import styles from "../styles/components/Favorite.module.css";

function Favorite({ favorite }) {
  const [imageURL, setImageURL] = useState("");
  const [randomColor, setRandomColor] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  useEffect(() => {
    if (!favorite.image.path) {
      setRandomColor(generateRandomColor());
      setImageURL("");
      return;
    }

    getDownloadURL(ref(storage, favorite.image.path))
      .then((url) => {
        setImageURL(url);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [favorite.image]);

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
    <>
      {deleteModal && (
        <DeleteModal favorite={favorite} setDeleteModal={setDeleteModal} />
      )}
      {editModal && (
        <FavoriteEditModal favorite={favorite} setEditModal={setEditModal} />
      )}
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
          <div
            className={styles.editContainer}
            onClick={() => setEditModal(true)}
          >
            <span className="material-icons">edit</span>
            <p>Edit</p>
          </div>
          <div
            className={styles.deleteContainer}
            onClick={() => setDeleteModal(true)}
          >
            <span className="material-icons">delete</span>
            <p>Delete</p>
          </div>
        </div>
        <h4 className={styles.title}>{favorite.title}</h4>
        <div className="line-break"></div>
        <h4>Category: {favorite.category}</h4>
        <h4>Rating: {favorite.rating}</h4>
      </div>
    </>
  );
}

export default Favorite;

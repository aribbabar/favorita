// react
import { useState } from "react";

// styles
import styles from "../styles/components/CategoryEditModal.module.css";

function replaceArrayItem(arr, oldValue, newValue) {
  const index = arr.indexOf(oldValue);
  if (index !== -1) {
    arr[index] = newValue;
  }
  return arr;
}

function CategoryEditModal({ category: cat, setEditModal, setItems }) {
  const [category, setCategory] = useState(cat);

  function handleSubmit(e) {
    e.preventDefault();

    setItems((oldItems) => {
      return [...replaceArrayItem(oldItems, cat, category)];
    });

    setEditModal(false);
  }

  function handleDelete(e) {
    e.preventDefault();

    setItems((oldItems) => {
      return [...oldItems.filter((item) => item !== cat)];
    });

    setEditModal(false);
  }

  return (
    <>
      <div
        className={styles.underlay}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setEditModal(false);
          }
        }}
      >
        <div className={styles.container}>
          <h2>Edit</h2>
          <div className="line-break"></div>
          <form className={styles.editForm}>
            <div className={styles.topContainer}>
              <input
                type="text"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                }}
              />
              <button onClick={handleDelete}>
                <span className="material-icons">delete</span>
              </button>
            </div>
            <button
              className={styles.submitBtn}
              type="submit"
              onClick={handleSubmit}
            >
              <span className="material-icons">done</span>
            </button>
            <button
              className={styles.closeBtn}
              onClick={() => setEditModal(false)}
            >
              <span className="material-icons">close</span>
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default CategoryEditModal;

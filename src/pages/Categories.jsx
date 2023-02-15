// react
import { useContext, useEffect, useState } from "react";

// dnd-kit
import {
  closestCenter,
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";

// components
import Category from "../components/Category";

// contexts
import { UserContext } from "../contexts/UserContext";

// assets
import Spinner from "../assets/Spinner.jsx";

// styles
import { doc, setDoc } from "@firebase/firestore";
import { db } from "../firebaseConfig";
import styles from "../styles/pages/Categories.module.css";

function valueExistsInArray(arr, value) {
  const lowerCaseValue = value.toLowerCase();
  return arr.some((item) => item.toLowerCase() === lowerCaseValue);
}

function Categories() {
  const [items, setItems] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [updated, setUpdated] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { user, dispatch } = useContext(UserContext);

  useEffect(() => {
    setItems(user.categories);
  }, [user.categories]);

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  function handleAdd(e) {
    e.preventDefault();

    if (newCategory === "") {
      return;
    }

    if (valueExistsInArray(items, newCategory)) {
      setError("Category already exists");

      return;
    }

    setItems([...items, newCategory]);

    setNewCategory("");
  }

  async function handleUpdate(e) {
    e.preventDefault();

    if (items.length === 0) {
      setError("Please add some categories");
      return;
    }

    setLoading(true);

    const userDoc = doc(db, "users", user.uid);

    try {
      await setDoc(userDoc, {
        categories: items
      });
    } catch (error) {
      const errorCode = error.code;

      console.log(errorCode);

      setError("Oops... Something went wrong!");
      setLoading(false);
      return;
    }

    dispatch({ type: "SET_CATEGORIES", categories: items });

    console.log("categories updated successfully");

    setUpdated(true);
    setLoading(false);
  }

  return (
    <>
      <div className={styles.container}>
        <h2>Categories</h2>
        <div className="line-break"></div>
        <form>
          <input
            type="text"
            placeholder="Name"
            value={newCategory}
            onChange={(e) => {
              setNewCategory(e.target.value);
              setError("");
              setUpdated(false);
            }}
          />
          <button type="submit" onClick={handleAdd}>
            Add
          </button>
        </form>
        <div className="line-break"></div>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            <div className={styles.categoriesContainer}>
              {items.map((category) => (
                <Category
                  key={category}
                  id={category}
                  category={category}
                  setItems={setItems}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
        <div className="line-break"></div>
        <button
          className={styles.submitBtn}
          disabled={loading}
          onClick={handleUpdate}
        >
          Update
        </button>
        {loading && <Spinner />}
        {error && <p className="text-error">{error}</p>}
        {updated && (
          <p className="text-green">Categories updated successfully!</p>
        )}
      </div>
    </>
  );
}

export default Categories;

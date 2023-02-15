// @dnd-kit
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";

// components
import CategoryEditModal from "./CategoryEditModal";

// styles
import styles from "../styles/components/Category.module.css";

function Category({ id, category, setItems }) {
  const [editModal, setEditModal] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition
  } = useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <>
      {editModal && (
        <CategoryEditModal
          category={category}
          setEditModal={setEditModal}
          setItems={setItems}
        />
      )}
      <div
        className={styles.container}
        ref={setNodeRef}
        style={style}
        {...attributes}
      >
        <p>{category}</p>
        <button onClick={() => setEditModal(!editModal)}>
          <span className="material-icons">edit</span>
        </button>
        <button
          className={styles.dragCursor}
          ref={setActivatorNodeRef}
          {...listeners}
        >
          <span className="material-icons">drag_handle</span>
        </button>
      </div>
    </>
  );
}

export default Category;

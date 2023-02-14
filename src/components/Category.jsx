import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import styles from "../styles/Category.module.css";

function Category({ index, category }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: index });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div
      className={styles.container}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <p>{index}</p>
      <p>{category}</p>
    </div>
  );
}

export default Category;

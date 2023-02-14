// react
import { useState } from "react";

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

import Category from "../components/Category";

// styles
import styles from "../styles/Categories.module.css";

function Categories() {
  const [items, setItems] = useState([3, 2, 1]);
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  function handleDragEnd(event) {
    console.log(event);
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  function handleSubmit() {
    console.log(items);
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.createNewCategoryContainer}>
          <h2>Create New Category</h2>
          <div className="line-break"></div>
          <form>
            <input type="text" placeholder="Name" />
            <button type="submit">Add</button>
          </form>
        </div>
        <div className={styles.sortCategoriesContainer}>
          <h2>Sort Categories</h2>
          <div className="line-break"></div>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={items}
              strategy={verticalListSortingStrategy}
            >
              <div className={styles.categoriesContainer}>
                {items.map((id) => (
                  <Category key={id} index={id} category={id} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
          <button onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </>
  );
}

export default Categories;

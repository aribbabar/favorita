// react
import { useContext, useEffect, useState } from "react";

// contexts
import { UserContext } from "../contexts/UserContext";

// styles
import styles from "../styles/components/FilterByCustomSelect.module.css";

function CustomSelect({
  filterValue,
  setFilterValue,
  handleFilterOptionClick
}) {
  const { user, dispatch } = useContext(UserContext);

  const [open, setOpen] = useState(false);
  const [rotate, setRotate] = useState(false);

  const [options, setOptions] = useState([]);

  useEffect(() => {
    setOptions(["All", ...user.categories]);
  }, [user.categories]);

  function toggleDropdown() {
    setOpen(!open);
  }

  function handleOptionClick(value) {
    setFilterValue(value);
    setOpen(false);
    flipRotate();

    handleFilterOptionClick(value);
  }

  function flipRotate() {
    setRotate(!rotate);
  }

  return (
    <div className={styles.customSelect}>
      <div
        className={styles.customSelectSelected}
        onClick={() => {
          toggleDropdown();
          flipRotate();
        }}
      >
        <p>Filter: {filterValue || options[0]} </p>
        <span className={`material-icons ${rotate ? "rotate" : ""}`}>
          expand_less
        </span>
      </div>
      {open && (
        <div className={styles.customSelectOptions}>
          {options.map((option) => (
            <button
              key={option}
              className={styles.customSelectOption}
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default CustomSelect;

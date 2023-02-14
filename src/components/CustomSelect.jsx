// react
import { useContext, useState } from "react";

// contexts
import { UserContext } from "../contexts/UserContext";

// styles
import styles from "../styles/CustomSelect.module.css";

function CustomSelect() {
  const { user, dispatch } = useContext(UserContext);

  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const [rotate, setRotate] = useState(false);
  const [orderBy, setOrderBy] = useState("DESC");

  const options = ["Alphabetical", "Rating"];

  function flipOrderBy() {
    setOrderBy((prev) => (prev === "ASC" ? "DESC" : "ASC"));
  }

  function optionChange(option) {
    switch (option) {
      case "Alphabetical":
        dispatch({
          type: "SORT_BY_GIVEN_PROPERTY",
          property: "title",
          orderBy: orderBy
        });
        flipOrderBy();

        break;
      case "Rating":
        dispatch({
          type: "SORT_BY_GIVEN_PROPERTY",
          property: "rating",
          orderBy: orderBy
        });
        flipOrderBy();

        break;
      default:
        console.log("invalid option:", option);
    }
  }

  function toggleDropdown() {
    setOpen(!open);
  }

  function handleOptionClick(value) {
    setSelectedValue(value);
    setOpen(false);
    flipRotate();

    optionChange(value);
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
        {selectedValue || options[0]}{" "}
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

import { useState } from "react";

import styles from "../styles/CustomSelect.module.css";

function CustomSelect({ options, onChange }) {
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const [rotate, setRotate] = useState(false);

  const toggleDropdown = () => setOpen(!open);

  const handleOptionClick = (value) => {
    setSelectedValue(value);
    setOpen(false);
    flipRotate();

    if (onChange) {
      onChange(value);
    }
  };

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

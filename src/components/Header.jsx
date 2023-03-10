// react
import { useEffect, useState } from "react";

// react router
import { Link } from "react-router-dom";

// components
import NavMenu from "./NavMenu";

// styles
import styles from "../styles/components/Header.module.css";

function Header() {
  const [modal, setModal] = useState(false);
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ? localStorage.getItem("theme") : "LIGHT"
  );

  useEffect(() => {
    localStorage.setItem("theme", theme);

    if (theme === "LIGHT") {
      document.querySelector(":root").setAttribute("color-scheme", "LIGHT");
    } else {
      document.querySelector(":root").setAttribute("color-scheme", "DARK");
    }
  }, [theme]);

  function flipModal() {
    setModal(!modal);
  }

  function flipTheme() {
    if (theme === "LIGHT") {
      setTheme("DARK");
    } else {
      setTheme("LIGHT");
    }
  }

  return (
    <>
      <header>
        <span className="material-icons" onClick={flipModal}>
          menu
        </span>
        <h1 className={styles.heading}>
          <Link to={"/"}>Favorita</Link>
        </h1>
        <span className="material-icons" onClick={flipTheme}>
          light_mode
        </span>
      </header>
      <div className="line-break primary-color"></div>
      {modal && <NavMenu flipModal={flipModal} />}
    </>
  );
}

export default Header;

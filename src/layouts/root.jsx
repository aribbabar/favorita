// react
import { Outlet } from "react-router-dom";

// components
import Header from "../components/Header";

// styles
import styles from "../styles/root.module.css";

function Root() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <div className="line-break primary-color"></div>
      <footer className={styles.footer}>
        <p>Made with ❤️ by Arib Farooqui</p>
      </footer>
    </>
  );
}

export default Root;

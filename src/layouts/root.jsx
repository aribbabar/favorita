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
      <footer className={styles.footer}>
        <p>Made with ❤️ by Arib Farooqui</p>
      </footer>
    </>
  );
}

export default Root;

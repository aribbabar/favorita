// react
import { Outlet } from "react-router-dom";

// context providers
import UserContextProvider from "../contexts/UserContext";

// components
import Header from "../components/Header";

// styles
import styles from "../styles/root.module.css";

function Root() {
  return (
    <>
      <UserContextProvider>
        <Header />
        <main>
          <Outlet />
        </main>
        <footer className={styles.footer}>
          <p>Made with ❤️ by Arib Farooqui</p>
        </footer>
      </UserContextProvider>
    </>
  );
}

export default Root;

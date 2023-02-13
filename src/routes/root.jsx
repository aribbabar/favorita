// react
import { Outlet } from "react-router-dom";

// context providers
import UserContextProvider from "../contexts/UserContext";

// components
import Header from "../components/Header";

function Root() {
  return (
    <>
      <UserContextProvider>
        <Header />
        <main>
          <Outlet />
        </main>
      </UserContextProvider>
    </>
  );
}

export default Root;

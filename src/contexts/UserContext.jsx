import { createContext } from "react";

const UserContext = createContext();

function UserContextProvider({ children }) {
  return <UserContext.Provider>{children}</UserContext.Provider>;
}

export default UserContextProvider;

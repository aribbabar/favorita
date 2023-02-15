// react
import { useContext } from "react";

// react-router
import { Navigate } from "react-router-dom";

// contexts
import { UserContext } from "../contexts/UserContext";

function ProtectedRoute({ children, authType }) {
  const { user, dispatch } = useContext(UserContext);

  if (authType === "LOGGED_IN") {
    if (!user.uid) {
      return <Navigate to="/" replace />;
    }
  } else if (authType === "LOGGED_OUT") {
    if (user.uid) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}

export default ProtectedRoute;

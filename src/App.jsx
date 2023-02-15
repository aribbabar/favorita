// react router
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from "react-router-dom";

// layouts
import Root from "./layouts/root";

// pages
import Categories from "./pages/Categories";
import CreateFavorite from "./pages/CreateFavorite";
import Error from "./pages/Error";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

// utils
import ProtectedRoute from "./utils/ProtectedRoute";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Root />} errorElement={<Error />}>
        <Route path="/" element={<Home />} />
        <Route
          path="login"
          element={
            <ProtectedRoute authType="LOGGED_OUT">
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path="register"
          element={
            <ProtectedRoute authType="LOGGED_OUT">
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path="create"
          element={
            <ProtectedRoute authType="LOGGED_IN">
              <CreateFavorite />
            </ProtectedRoute>
          }
        />
        <Route
          path="categories"
          element={
            <ProtectedRoute authType="LOGGED_IN">
              <Categories />
            </ProtectedRoute>
          }
        />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;

import { useNavigate, useRouteError } from "react-router-dom";

import styles from "../styles/pages/Error.module.css";

export default function Error() {
  const error = useRouteError();
  const navigate = useNavigate();

  console.error(error);

  return (
    <div className={styles.container}>
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
      <button onClick={() => navigate("/")}>Home</button>
    </div>
  );
}

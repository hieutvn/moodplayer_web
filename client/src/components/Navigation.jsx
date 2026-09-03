import { useEffect } from "react";

import UserInput from "./UserInput";
import Settings from "./Settings";

import styles from "../assets/styles/navigation.module.css";

import { useAccessTokenContext } from "../contexts/AccessTokenContext.jsx";



export default function Navigation() {

  const accessToken = useAccessTokenContext();

  return !accessToken ?

    <h1>Loading...</h1>
    :
    (
      <nav className={styles.navbar}>
        <div className={styles.navbar_wrapper}>
          <div className={styles.logo}>moodply.</div>
          <Settings accessToken={accessToken} />
        </div>
      </nav>
    );
}
